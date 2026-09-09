using System.Text.Json;
using global::Umbraco.Community.Catalyst;
using global::Umbraco.Community.Catalyst.Core.Abstractions;
using global::Umbraco.Community.Catalyst.DataTypes.StarRating;
using global::Umbraco.Community.Catalyst.Models;
using CatalystJsonOptions = global::Umbraco.Community.Catalyst.Core.Abstractions.CatalystJsonOptions;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.PublishedCache;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Web;
using Umbraco.Extensions;

namespace Umbraco.Community.Catalyst.Services;

/// <summary>
/// Generic implementation of ICatalystDataTypeService.
/// One instance handles all CRUD operations for one data type.
/// Uses Umbraco's IContentService for writes and IPublishedContentCache for reads.
/// Does NOT touch Umbraco's database schema directly.
/// </summary>
internal sealed class CatalystDataTypeService<TValue> : ICatalystDataTypeService<TValue>
    where TValue : class, ICatalystValue
{
    private readonly IContentService _contentService;
    private readonly IPublishedContentCache _publishedCache;
    private readonly IUmbracoContextFactory _contextFactory;
    private readonly IDataTypeService _dataTypeService;

    // The static Empty instance on each value type - used for null-safe returns
    private static readonly TValue _empty = GetEmptyInstance();

    public CatalystDataTypeService(
        IContentService contentService,
        IPublishedContentCache publishedCache,
        IUmbracoContextFactory contextFactory,
        IDataTypeService dataTypeService)
    {
        _contentService = contentService;
        _publishedCache = publishedCache;
        _contextFactory = contextFactory;
        _dataTypeService = dataTypeService;
    }

    /// <inheritdoc />
    public Task<TValue?> GetAsync(Guid contentId, string propertyAlias)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(propertyAlias);

        using var ctx = _contextFactory.EnsureUmbracoContext();

        var content = _publishedCache.GetById(contentId);
        if (content is null)
            return Task.FromResult<TValue?>(null);

        var value = content.Value<TValue>(propertyAlias);
        return Task.FromResult(value);
    }

    /// <inheritdoc />
    public async Task<TValue> GetOrEmptyAsync(Guid contentId, string propertyAlias)
    {
        var value = await GetAsync(contentId, propertyAlias);
        return value ?? _empty;
    }

    /// <inheritdoc />
    public async Task<bool> HasValueAsync(Guid contentId, string propertyAlias)
    {
        var value = await GetAsync(contentId, propertyAlias);
        return value?.HasValue == true;
    }

    /// <inheritdoc />
    public Task<bool> SetAsync(
        Guid contentId,
        string propertyAlias,
        TValue value,
        SaveMode saveMode = SaveMode.Draft)
    {
        ArgumentNullException.ThrowIfNull(value);
        ArgumentException.ThrowIfNullOrWhiteSpace(propertyAlias);

        var content = _contentService.GetById(contentId);
        if (content is null) return Task.FromResult(false);

        value = GetValueForSave(content, propertyAlias, value);
        var json = JsonSerializer.Serialize(value, CatalystJsonOptions.CamelCase);
        content.SetValue(propertyAlias, json);

        return Task.FromResult(ApplySaveMode(content, saveMode));
    }

    /// <inheritdoc />
    public async Task<bool> UpdateAsync(
        Guid contentId,
        string propertyAlias,
        Func<TValue, TValue> update,
        SaveMode saveMode = SaveMode.Draft)
    {
        ArgumentNullException.ThrowIfNull(update);

        var current = await GetAsync(contentId, propertyAlias);
        if (current is null) return false;

        var updated = update(current);
        return await SetAsync(contentId, propertyAlias, updated, saveMode);
    }

    /// <inheritdoc />
    public Task<bool> ClearAsync(Guid contentId, string propertyAlias)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(propertyAlias);

        var content = _contentService.GetById(contentId);
        if (content is null) return Task.FromResult(false);

        content.SetValue(propertyAlias, null);
        var result = _contentService.Save(content);
        return Task.FromResult(result.Success);
    }

    /// <inheritdoc />
    public Task<bool> SetAndPublishAsync(Guid contentId, string propertyAlias, TValue value)
        => SetAsync(contentId, propertyAlias, value, SaveMode.SaveAndPublish);

    /// <summary>
    /// Applies the requested save mode. SaveAndPublish saves then publishes all cultures;
    /// Draft and SaveOnly both persist a draft revision (the raiseEvents:false override from
    /// older Umbraco versions is no longer exposed by IContentService in v17+).
    /// </summary>
    private bool ApplySaveMode(IContent content, SaveMode mode)
    {
        var saveResult = _contentService.Save(content);
        if (!saveResult.Success) return false;

        if (mode != SaveMode.SaveAndPublish) return true;

        // IContentService.Publish only exposes an int userId overload; SuperUserKey has no sync equivalent yet.
#pragma warning disable CS0618
        var publishResult = _contentService.Publish(content, ["*"], Constants.Security.SuperUserId);
#pragma warning restore CS0618
        return publishResult.Success;
    }

    private TValue GetValueForSave(IContent content, string propertyAlias, TValue value)
    {
        if (typeof(TValue) != typeof(StarRatingValue)) return value;

        var property = content.Properties.FirstOrDefault(p =>
            p.Alias.Equals(propertyAlias, StringComparison.OrdinalIgnoreCase))
            ?? throw new ArgumentException($"Property '{propertyAlias}' not found on this content type.", nameof(propertyAlias));

        var dataType = _dataTypeService.GetDataType(property.PropertyType.DataTypeId)
            ?? throw new InvalidOperationException("Star Rating data type configuration was not found.");

        var configuration = JsonSerializer.Deserialize<StarRatingConfiguration>(
            JsonSerializer.Serialize(dataType.ConfigurationData), CatalystJsonOptions.CamelCase)
            ?? new StarRatingConfiguration();
        var maxStars = configuration.MaxStars > 0 ? configuration.MaxStars : 5;
        var rating = ((StarRatingValue)(object)value).Rating;

        if (rating > maxStars)
            throw new ArgumentOutOfRangeException(nameof(value),
                $"Rating must not exceed maximum allowed rating of {maxStars}.");
        if (rating < 0 || (!configuration.AllowZero && rating == 0))
            throw new ArgumentOutOfRangeException(nameof(value), configuration.AllowZero
                ? "Rating must not be negative."
                : "Rating must be greater than zero.");
        if (!configuration.AllowHalfStars && rating % 1 != 0)
            throw new ArgumentException("Half-star ratings are not allowed for this property.", nameof(value));
        if (configuration.AllowHalfStars && rating % 0.5m != 0)
            throw new ArgumentException("Rating must use whole-star or half-star increments.", nameof(value));

        return (TValue)(object)new StarRatingValue
        {
            Rating = rating,
            MaxStars = maxStars,
            AllowHalfStars = configuration.AllowHalfStars
        };
    }

    /// <summary>
    /// Resolves the static Empty property on TValue via reflection.
    /// Every Catalyst value class has a public static readonly Empty field.
    /// </summary>
    private static TValue GetEmptyInstance()
    {
        var field = typeof(TValue).GetField(
            "Empty",
            System.Reflection.BindingFlags.Public |
            System.Reflection.BindingFlags.Static);

        return field?.GetValue(null) as TValue
               ?? throw new InvalidOperationException(
                   $"{typeof(TValue).Name} must have a public static readonly Empty field.");
    }
}

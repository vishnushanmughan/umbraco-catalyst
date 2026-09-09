using System.Text.Json;
using global::Phases.Umbraco.Community.Catalyst;
using CatalystJsonOptions = global::Phases.Umbraco.Community.Catalyst.Core.Abstractions.CatalystJsonOptions;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;

namespace Phases.Umbraco.Community.Catalyst.DataTypes.StarRating;

/// <summary>
/// Converts the raw JSON stored by the Star Rating editor into a
/// strongly typed <see cref="StarRatingValue"/> object.
/// Automatically registered by Umbraco's DI - no manual registration needed.
/// </summary>
public sealed class StarRatingValueConverter : PropertyValueConverterBase
{
    /// <inheritdoc />
    public override bool IsConverter(IPublishedPropertyType propertyType) =>
        propertyType.EditorAlias.Equals(StarRatingDataEditor.EditorAlias,
            StringComparison.OrdinalIgnoreCase);

    /// <inheritdoc />
    public override Type GetPropertyValueType(IPublishedPropertyType propertyType) =>
        typeof(StarRatingValue);

    /// <inheritdoc />
    public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType) =>
        PropertyCacheLevel.Element;

    /// <inheritdoc />
    public override object? ConvertIntermediateToObject(
        IPublishedElement owner,
        IPublishedPropertyType propertyType,
        PropertyCacheLevel referenceCacheLevel,
        object? inter,
        bool preview)
    {
        if (inter is not string json || string.IsNullOrWhiteSpace(json))
            return StarRatingValue.Empty;

        try
        {
            var stored = JsonSerializer.Deserialize<StarRatingStoredData>(json,
                CatalystJsonOptions.CamelCase);

            if (stored is null)
                return StarRatingValue.Empty;

            var configuration = JsonSerializer.Deserialize<StarRatingConfiguration>(
                JsonSerializer.Serialize(propertyType.DataType.ConfigurationObject),
                CatalystJsonOptions.CamelCase) ?? new StarRatingConfiguration();

            return new StarRatingValue
            {
                Rating = stored.Rating,
                MaxStars = stored.MaxStars > 0 ? stored.MaxStars : 5,
                AllowHalfStars = stored.AllowHalfStars,
                ConfigOrganisationName = configuration?.SchemaOrganisationName ?? string.Empty,
                ConfigItemType = string.IsNullOrWhiteSpace(configuration?.SchemaItemType)
                    ? "Product"
                    : configuration.SchemaItemType
            };
        }
        catch (JsonException)
        {
            return StarRatingValue.Empty;
        }
    }

    // Private DTO - only used inside this converter, not exposed publicly.
    private sealed record StarRatingStoredData(
        decimal Rating,
        int MaxStars,
        bool AllowHalfStars);
}

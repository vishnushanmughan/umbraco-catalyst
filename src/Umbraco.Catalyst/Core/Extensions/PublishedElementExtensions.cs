using Phases.Umbraco.Community.Catalyst.Core.Abstractions;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Extensions;

namespace Phases.Umbraco.Community.Catalyst.Core.Extensions;

/// <summary>
/// Extension methods on IPublishedElement and IPublishedContent
/// for retrieving Catalyst property values with null safety.
/// </summary>
public static class PublishedElementExtensions
{
    /// <summary>
    /// Returns a strongly typed Catalyst value for the given property alias.
    /// Returns null if the property is missing, empty, or cannot be converted.
    /// </summary>
    /// <typeparam name="TValue">Must implement ICatalystValue.</typeparam>
    /// <param name="content">The published content or element.</param>
    /// <param name="propertyAlias">Alias as defined on the Document Type.</param>
    public static TValue? CatalystValue<TValue>(
        this IPublishedElement content,
        string propertyAlias)
        where TValue : class, ICatalystValue
    {
        ArgumentNullException.ThrowIfNull(content);
        ArgumentException.ThrowIfNullOrWhiteSpace(propertyAlias);
        return content.Value<TValue>(propertyAlias);
    }

    /// <summary>
    /// Returns a strongly typed Catalyst value, or the specified fallback
    /// if the property is missing or empty.
    /// </summary>
    public static TValue CatalystValueOrDefault<TValue>(
        this IPublishedElement content,
        string propertyAlias,
        TValue fallback)
        where TValue : class, ICatalystValue
    {
        ArgumentNullException.ThrowIfNull(content);
        ArgumentException.ThrowIfNullOrWhiteSpace(propertyAlias);
        return content.Value<TValue>(propertyAlias) ?? fallback;
    }
}

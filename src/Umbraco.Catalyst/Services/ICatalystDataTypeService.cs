using Umbraco.Community.Catalyst.Core.Abstractions;
using Umbraco.Community.Catalyst.Models;

namespace Umbraco.Community.Catalyst.Services;

/// <summary>
/// Generic service interface for reading and writing a single Catalyst data type
/// on any Umbraco content node.
///
/// One instance of this interface exists per data type.
/// Access the typed services via <see cref="ICatalystContentService"/>.
///
/// All write operations use Umbraco's IContentService internally.
/// No direct database access. No Umbraco schema changes.
/// </summary>
/// <typeparam name="TValue">
/// The strongly typed value model for this data type.
/// Must implement <see cref="ICatalystValue"/>.
/// </typeparam>
public interface ICatalystDataTypeService<TValue>
    where TValue : class, ICatalystValue
{
    /// <summary>
    /// Returns the typed value for the given property alias on the content node.
    /// Returns null if the content node does not exist or the property has no value.
    /// Reads from the published cache - fast, no database hit.
    /// </summary>
    Task<TValue?> GetAsync(Guid contentId, string propertyAlias);

    /// <summary>
    /// Same as GetAsync but returns the data type's Empty instance
    /// instead of null when no value is found.
    /// </summary>
    Task<TValue> GetOrEmptyAsync(Guid contentId, string propertyAlias);

    /// <summary>
    /// Returns true if the property exists and HasValue is true.
    /// </summary>
    Task<bool> HasValueAsync(Guid contentId, string propertyAlias);

    /// <summary>
    /// Sets the value of the property on the content node.
    /// Saves as draft by default - does NOT auto-publish.
    /// Returns true if the save succeeded.
    /// </summary>
    Task<bool> SetAsync(
        Guid contentId,
        string propertyAlias,
        TValue value,
        SaveMode saveMode = SaveMode.Draft);

    /// <summary>
    /// Reads the current value, applies your update function, then saves the result.
    /// Returns false if the content node does not exist or has no current value.
    ///
    /// Example:
    ///   await service.UpdateAsync(pageId, "rating", current => current with { Rating = 5m });
    /// </summary>
    Task<bool> UpdateAsync(
        Guid contentId,
        string propertyAlias,
        Func<TValue, TValue> update,
        SaveMode saveMode = SaveMode.Draft);

    /// <summary>
    /// Clears the property value on the content node.
    /// After clearing, HasValue will return false.
    /// Saves as draft - does NOT auto-publish the cleared state.
    /// </summary>
    Task<bool> ClearAsync(Guid contentId, string propertyAlias);

    /// <summary>
    /// Sets the value AND immediately publishes the content node.
    /// </summary>
    Task<bool> SetAndPublishAsync(Guid contentId, string propertyAlias, TValue value);
}

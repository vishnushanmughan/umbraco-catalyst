using System.Text.Json.Nodes;

namespace Phases.Umbraco.Community.Catalyst.Models;

/// <summary>
/// Request body model for REST write endpoints.
/// Used by POST requests to set a Catalyst property value.
///
/// Example JSON body:
/// {
///   "editorAlias": "Catalyst.StarRating",
///   "value": { "rating": 4.5, "maxStars": 5, "allowHalfStars": true },
///   "saveMode": "Draft"
/// }
/// </summary>
public sealed class CatalystSetRequest
{
    /// <summary>
    /// The Catalyst editor alias for this property.
    /// Must match one of the 10 registered aliases.
    /// Example: "Catalyst.StarRating", "Catalyst.CdnImage"
    /// </summary>
    public string EditorAlias { get; init; } = string.Empty;

    /// <summary>
    /// The value to store. Must be valid JSON matching the data type's model.
    /// </summary>
    public JsonNode? Value { get; init; }

    /// <summary>
    /// What to do after saving the value.
    /// Defaults to Draft - does not auto-publish.
    /// </summary>
    public SaveMode SaveMode { get; init; } = SaveMode.Draft;
}

/// <summary>
/// Controls what happens to Umbraco content after a Catalyst value is written.
/// </summary>
public enum SaveMode
{
    Draft,
    SaveAndPublish,
    SaveOnly
}

/// <summary>
/// Response returned by REST write endpoints after setting a Catalyst value.
/// </summary>
public sealed class CatalystSetResponse
{
    public Guid ContentId { get; init; }
    public string PropertyAlias { get; init; } = string.Empty;
    public bool Saved { get; init; }
    public string SaveMode { get; init; } = string.Empty;
    public object? SavedValue { get; init; }
    public string Message { get; init; } = string.Empty;
}

using System.Text.Json.Nodes;

namespace Umbraco.Catalyst.Models;

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

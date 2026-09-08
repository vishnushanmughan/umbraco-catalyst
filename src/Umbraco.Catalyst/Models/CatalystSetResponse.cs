namespace Umbraco.Catalyst.Models;

/// <summary>
/// Response returned by REST write endpoints after setting a Catalyst value.
/// </summary>
public sealed class CatalystSetResponse
{
    /// <summary>The content node ID that was updated.</summary>
    public Guid ContentId { get; init; }

    /// <summary>The property alias that was updated.</summary>
    public string PropertyAlias { get; init; } = string.Empty;

    /// <summary>True if the save operation succeeded.</summary>
    public bool Saved { get; init; }

    /// <summary>The save mode that was applied.</summary>
    public string SaveMode { get; init; } = string.Empty;

    /// <summary>
    /// The value as read back from Umbraco after saving.
    /// Allows callers to confirm the value was stored correctly.
    /// </summary>
    public object? SavedValue { get; init; }

    /// <summary>
    /// Human-readable message. Contains error details if Saved is false.
    /// </summary>
    public string Message { get; init; } = string.Empty;
}

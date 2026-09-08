namespace Umbraco.Catalyst.Models;

/// <summary>
/// Controls what happens to the Umbraco content node after a Catalyst value is written.
/// </summary>
public enum SaveMode
{
    /// <summary>
    /// Saves the value as a draft only.
    /// The change will NOT be visible on the live site until the editor publishes.
    /// Recommended for programmatic updates that need editorial review.
    /// </summary>
    Draft,

    /// <summary>
    /// Saves the value and immediately publishes the content node.
    /// The change will be live on the website instantly.
    /// Use with caution in automated scenarios.
    /// </summary>
    SaveAndPublish,

    /// <summary>
    /// Saves the raw value to the database only, without raising the publish pipeline.
    /// Use only when you know what you are doing.
    /// </summary>
    SaveOnly
}

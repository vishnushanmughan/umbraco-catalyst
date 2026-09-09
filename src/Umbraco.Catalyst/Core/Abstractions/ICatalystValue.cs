namespace Phases.Umbraco.Community.Catalyst.Core.Abstractions;

/// <summary>
/// Root interface implemented by every Catalyst property value model.
/// Provides a consistent null-safe HasValue check across all data types.
/// </summary>
public interface ICatalystValue
{
    /// <summary>
    /// True when the property contains meaningful data that can be rendered.
    /// Always guard your Razor views with this check before accessing properties.
    /// </summary>
    bool HasValue { get; }
}

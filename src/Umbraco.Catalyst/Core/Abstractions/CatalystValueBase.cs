using System.Text.Json;

namespace Phases.Umbraco.Community.Catalyst.Core.Abstractions;

/// <summary>
/// Abstract base class for all Catalyst property value models.
/// Subclasses implement ComputeHasValue() to define their own
/// definition of "contains meaningful data".
/// </summary>
public abstract class CatalystValueBase : ICatalystValue
{
    /// <inheritdoc />
    public bool HasValue => ComputeHasValue();

    /// <summary>
    /// Override this in each data type value class.
    /// Return true only when the stored data is complete enough to render.
    /// </summary>
    protected abstract bool ComputeHasValue();
}

internal static class CatalystJsonOptions
{
    public static readonly JsonSerializerOptions CamelCase = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
        WriteIndented = false
    };
}

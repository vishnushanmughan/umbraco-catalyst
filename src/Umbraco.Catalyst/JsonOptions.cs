using System.Text.Json;

namespace Umbraco.Catalyst;

/// <summary>
/// Shared JsonSerializerOptions instances for Catalyst converters.
/// Static singletons - do not create new instances in each converter.
/// </summary>
internal static class JsonOptions
{
    public static readonly JsonSerializerOptions CamelCase = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
        WriteIndented = false
    };

    public static readonly JsonSerializerOptions CamelCaseIndented = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        PropertyNameCaseInsensitive = true,
        WriteIndented = true
    };
}

using System.Text.Json;
using global::Phases.Umbraco.Community.Catalyst;
using CatalystJsonOptions = global::Phases.Umbraco.Community.Catalyst.Core.Abstractions.CatalystJsonOptions;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.PropertyEditors;

namespace Phases.Umbraco.Community.Catalyst.DataTypes.CdnImage;

public sealed class CdnImageValueConverter : PropertyValueConverterBase
{
    public override bool IsConverter(IPublishedPropertyType propertyType) =>
        propertyType.EditorAlias.Equals(CdnImageDataEditor.EditorAlias,
            StringComparison.OrdinalIgnoreCase);

    public override Type GetPropertyValueType(IPublishedPropertyType propertyType) =>
        typeof(CdnImageValue);

    public override PropertyCacheLevel GetPropertyCacheLevel(IPublishedPropertyType propertyType) =>
        PropertyCacheLevel.Element;

    public override object? ConvertIntermediateToObject(
        IPublishedElement owner,
        IPublishedPropertyType propertyType,
        PropertyCacheLevel referenceCacheLevel,
        object? inter,
        bool preview)
    {
        if (inter is not string json || string.IsNullOrWhiteSpace(json))
            return CdnImageValue.Empty;

        try
        {
            var stored = JsonSerializer.Deserialize<CdnImageStoredData>(json,
                CatalystJsonOptions.CamelCase);

            if (stored is null || string.IsNullOrWhiteSpace(stored.Url))
                return CdnImageValue.Empty;

            return new CdnImageValue
            {
                Url = stored.Url.Trim(),
                AltText = stored.AltText?.Trim() ?? string.Empty
            };
        }
        catch (JsonException)
        {
            return CdnImageValue.Empty;
        }
    }

    private sealed record CdnImageStoredData(string Url, string? AltText);
}

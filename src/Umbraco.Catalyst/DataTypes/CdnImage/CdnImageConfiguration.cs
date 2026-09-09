using Phases.Umbraco.Community.Catalyst.Core.Abstractions;
using Umbraco.Cms.Core.PropertyEditors;

namespace Phases.Umbraco.Community.Catalyst.DataTypes.CdnImage;

public sealed class CdnImageConfiguration : ICatalystConfiguration
{
    [ConfigurationField("allowedPrefixes")]
    public string AllowedPrefixes { get; set; } = string.Empty;

    [ConfigurationField("requireAltText")]
    public bool RequireAltText { get; set; } = true;

    [ConfigurationField("previewHeight")]
    public int PreviewHeight { get; set; } = 200;
}

using Phases.Umbraco.Community.Catalyst.Core.Abstractions;
using Umbraco.Cms.Core.PropertyEditors;

namespace Phases.Umbraco.Community.Catalyst.DataTypes.StarRating;

/// <summary>
/// Prevalues for the Catalyst Star Rating property editor.
/// Displayed in Settings to Data Types when configuring this editor.
/// </summary>
public sealed class StarRatingConfiguration : ICatalystConfiguration
{
    [ConfigurationField("maxStars")]
    public int MaxStars { get; set; } = 5;

    [ConfigurationField("allowHalfStars")]
    public bool AllowHalfStars { get; set; } = true;

    [ConfigurationField("allowZero")]
    public bool AllowZero { get; set; } = true;

    [ConfigurationField("schemaOrganisationName")]
    public string SchemaOrganisationName { get; set; } = string.Empty;

    [ConfigurationField("schemaItemType")]
    public string SchemaItemType { get; set; } = "Product";
}

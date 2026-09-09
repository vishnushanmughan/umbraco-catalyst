using Umbraco.Community.Catalyst.Core.Abstractions;

namespace Umbraco.Community.Catalyst.DataTypes.CdnImage;

/// <summary>
/// Strongly typed model for a CDN-hosted image with URL and alt text.
///
/// Razor usage:
///   var image = Model.CatalystValue&lt;CdnImageValue&gt;("heroBanner");
///   if (image?.HasValue == true)
///   {
///       // &lt;img src="@image.Url" alt="@image.AltText" /&gt;
///   }
/// </summary>
public sealed class CdnImageValue : CatalystValueBase
{
    /// <summary>The absolute URL to the image on the CDN.</summary>
    public string Url { get; init; } = string.Empty;

    /// <summary>
    /// Descriptive alt text for the image.
    /// Empty string means the image is decorative (alt="").
    /// </summary>
    public string AltText { get; init; } = string.Empty;

    /// <summary>Pre-built empty instance for null-safe returns.</summary>
    public static readonly CdnImageValue Empty = new();

    /// <inheritdoc />
    protected override bool ComputeHasValue() =>
        !string.IsNullOrWhiteSpace(Url);

    /// <summary>
    /// Returns a full HTML img tag string with lazy loading.
    /// The developer can use this or render their own markup using Url and AltText.
    /// </summary>
    public string ToImgTag(string? cssClass = null, string loading = "lazy") =>
        HasValue
            ? $"""<img src="{Url}" alt="{System.Net.WebUtility.HtmlEncode(AltText)}"{(cssClass is not null ? $" class=\"{cssClass}\"" : "")} loading="{loading}">"""
            : string.Empty;

    /// <inheritdoc />
    public override string ToString() =>
        HasValue ? $"[Image: {Url}]" : "[No image]";
}

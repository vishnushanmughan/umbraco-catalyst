using System.Text.Json;
using System.Text.Json.Serialization;
using Umbraco.Community.Catalyst.Core.Abstractions;

namespace Umbraco.Community.Catalyst.DataTypes.StarRating;

/// <summary>
/// Strongly typed model returned when reading a Catalyst Star Rating property.
///
/// Razor usage:
///   var rating = Model.CatalystValue&lt;StarRatingValue&gt;("myRatingProperty");
///   if (rating?.HasValue == true)
///   {
///       // rating.Rating   -> e.g. 4.5
///       // rating.MaxStars -> e.g. 5
///   }
/// </summary>
public sealed class StarRatingValue : CatalystValueBase
{
    /// <summary>The selected rating. Whole or half number e.g. 4, 3.5, 2.</summary>
    public decimal Rating { get; init; }

    /// <summary>The maximum stars as configured on the data type.</summary>
    public int MaxStars { get; init; }

    /// <summary>Whether half-star selection is enabled on this data type instance.</summary>
    public bool AllowHalfStars { get; init; }

    internal string ConfigOrganisationName { get; init; } = string.Empty;

    internal string ConfigItemType { get; init; } = "Product";

    /// <summary>
    /// A pre-built empty instance. Converters return this instead of null
    /// so developers always receive an object, never a null reference.
    /// </summary>
    public static readonly StarRatingValue Empty = new()
    {
        Rating = 0,
        MaxStars = 5,
        AllowHalfStars = true
    };

    /// <inheritdoc />
    protected override bool ComputeHasValue() => Rating > 0;

    /// <inheritdoc />
    public override string ToString() =>
        HasValue ? $"{Rating} out of {MaxStars} stars" : "No rating";

    public string ToMinimalSchema(string itemName)
    {
        if (!HasValue || string.IsNullOrWhiteSpace(itemName) || string.IsNullOrWhiteSpace(ConfigOrganisationName))
            return string.Empty;

        return ToSchema(itemName, ConfigItemType, null, null, null, null,
            ConfigOrganisationName, SchemaAuthorType.Organization, null, null, null, null);
    }

    public string ToFullSchema(string itemName, StarRatingSchemaOptions? options = null)
    {
        if (!HasValue || string.IsNullOrWhiteSpace(itemName)) return string.Empty;

        options ??= new StarRatingSchemaOptions();
        var authorFromOptions = !string.IsNullOrWhiteSpace(options.AuthorName);
        var authorName = authorFromOptions ? options.AuthorName : ConfigOrganisationName;
        var authorType = authorFromOptions ? options.AuthorType : SchemaAuthorType.Organization;
        var itemType = !string.IsNullOrWhiteSpace(options.ItemType)
            ? options.ItemType
            : !string.IsNullOrWhiteSpace(ConfigItemType) ? ConfigItemType : "Product";

        return ToSchema(itemName, itemType, options.ItemUrl, options.ItemImageUrl,
            options.ReviewCount, options.ReviewBody, authorName, authorType,
            options.ReviewDate, options.ReviewModified, options.PublisherName, options.PublisherUrl);
    }

    private string ToSchema(
        string itemName, string itemType, string? itemUrl, string? imageUrl, int? reviewCount,
        string? reviewBody, string? authorName, SchemaAuthorType authorType,
        DateTime? reviewDate, DateTime? reviewModified, string? publisherName, string? publisherUrl)
    {
        var review = new Dictionary<string, object?>
        {
            ["@type"] = "Review",
            ["reviewRating"] = RatingSchema()
        };

        AddIfPresent(review, "reviewBody", reviewBody);
        AddIfPresent(review, "datePublished", reviewDate?.ToString("yyyy-MM-dd"));
        AddIfPresent(review, "dateModified", reviewModified?.ToString("yyyy-MM-dd"));

        if (!string.IsNullOrWhiteSpace(authorName))
            review["author"] = new Dictionary<string, object>
            {
                ["@type"] = authorType == SchemaAuthorType.Person ? "Person" : "Organization",
                ["name"] = authorName
            };

        if (!string.IsNullOrWhiteSpace(publisherName))
        {
            var publisher = new Dictionary<string, object> { ["@type"] = "Organization", ["name"] = publisherName };
            if (!string.IsNullOrWhiteSpace(publisherUrl)) publisher["url"] = publisherUrl;
            review["publisher"] = publisher;
        }

        var schema = new Dictionary<string, object?>
        {
            ["@context"] = "https://schema.org",
            ["@type"] = itemType,
            ["name"] = itemName,
            ["review"] = review
        };

        AddIfPresent(schema, "url", itemUrl);
        AddIfPresent(schema, "image", imageUrl);
        if (reviewCount is > 0)
        {
            var aggregateRating = RatingSchema();
            aggregateRating["@type"] = "AggregateRating";
            aggregateRating["ratingCount"] = reviewCount.Value.ToString();
            schema["aggregateRating"] = aggregateRating;
        }

        var json = JsonSerializer.Serialize(schema, new JsonSerializerOptions
        {
            WriteIndented = true,
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
        });
        return $"<script type=\"application/ld+json\">{json}</script>";
    }

    private Dictionary<string, object> RatingSchema() => new()
    {
        ["@type"] = "Rating",
        ["ratingValue"] = Rating.ToString("0.#", System.Globalization.CultureInfo.InvariantCulture),
        ["bestRating"] = MaxStars.ToString(System.Globalization.CultureInfo.InvariantCulture),
        ["worstRating"] = "1"
    };

    private static void AddIfPresent(Dictionary<string, object?> dictionary, string key, string? value)
    {
        if (!string.IsNullOrWhiteSpace(value)) dictionary[key] = value;
    }
}

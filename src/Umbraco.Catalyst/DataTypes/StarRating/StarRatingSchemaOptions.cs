namespace Phases.Umbraco.Community.Catalyst.DataTypes.StarRating;

/// <summary>Optional values included by <see cref="StarRatingValue.ToFullSchema"/>.</summary>
public sealed class StarRatingSchemaOptions
{
    public int? ReviewCount { get; init; }
    public string? ReviewBody { get; init; }
    public string? AuthorName { get; init; }
    public SchemaAuthorType AuthorType { get; init; } = SchemaAuthorType.Organization;
    public DateTime? ReviewDate { get; init; }
    public DateTime? ReviewModified { get; init; }
    public string? ItemUrl { get; init; }
    public string? ItemImageUrl { get; init; }
    public string? ItemType { get; init; }
    public string? PublisherName { get; init; }
    public string? PublisherUrl { get; init; }
}

public enum SchemaAuthorType
{
    Person,
    Organization
}
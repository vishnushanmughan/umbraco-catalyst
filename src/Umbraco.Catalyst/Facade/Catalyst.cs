using Umbraco.Catalyst.DataTypes.CdnImage;
using Umbraco.Catalyst.DataTypes.StarRating;
using Umbraco.Catalyst.Models;
using Umbraco.Catalyst.Services;

namespace Umbraco.Catalyst;

/// <summary>Static shorthand facade for the Catalyst content services.</summary>
public static class Catalyst
{
    private static ICatalystContentService _service = null!;

    internal static void Initialise(ICatalystContentService service)
        => _service = service ?? throw new ArgumentNullException(nameof(service));

    /// <summary>Read and write Star Rating properties.</summary>
    public static class StarRating
    {
        public static Task<StarRatingValue?> Get(Guid contentId, string propertyAlias)
            => _service.StarRating.GetAsync(contentId, propertyAlias);

        public static Task<StarRatingValue> GetOrEmpty(Guid contentId, string propertyAlias)
            => _service.StarRating.GetOrEmptyAsync(contentId, propertyAlias);

        public static Task<bool> HasValue(Guid contentId, string propertyAlias)
            => _service.StarRating.HasValueAsync(contentId, propertyAlias);

        public static Task<bool> Set(Guid contentId, string propertyAlias,
            StarRatingValue value, SaveMode saveMode = SaveMode.Draft)
            => _service.StarRating.SetAsync(contentId, propertyAlias, value, saveMode);

        public static Task<bool> Set(Guid contentId, string propertyAlias,
            decimal rating, SaveMode saveMode = SaveMode.Draft)
            => _service.StarRating.SetAsync(contentId, propertyAlias,
                new StarRatingValue
                {
                    Rating = rating
                }, saveMode);

        public static Task<bool> SetAndPublish(Guid contentId, string propertyAlias,
            StarRatingValue value)
            => _service.StarRating.SetAndPublishAsync(contentId, propertyAlias, value);

        public static Task<bool> Update(Guid contentId, string propertyAlias,
            Func<StarRatingValue, StarRatingValue> update,
            SaveMode saveMode = SaveMode.Draft)
            => _service.StarRating.UpdateAsync(contentId, propertyAlias, update, saveMode);

        public static Task<bool> Clear(Guid contentId, string propertyAlias)
            => _service.StarRating.ClearAsync(contentId, propertyAlias);
    }

    /// <summary>Read and write CDN Image properties.</summary>
    public static class CdnImage
    {
        public static Task<CdnImageValue?> Get(Guid contentId, string propertyAlias)
            => _service.CdnImage.GetAsync(contentId, propertyAlias);

        public static Task<CdnImageValue> GetOrEmpty(Guid contentId, string propertyAlias)
            => _service.CdnImage.GetOrEmptyAsync(contentId, propertyAlias);

        public static Task<bool> HasValue(Guid contentId, string propertyAlias)
            => _service.CdnImage.HasValueAsync(contentId, propertyAlias);

        public static Task<bool> Set(Guid contentId, string propertyAlias,
            CdnImageValue value, SaveMode saveMode = SaveMode.Draft)
            => _service.CdnImage.SetAsync(contentId, propertyAlias, value, saveMode);

        public static Task<bool> Set(Guid contentId, string propertyAlias,
            string url, string altText, SaveMode saveMode = SaveMode.Draft)
            => _service.CdnImage.SetAsync(contentId, propertyAlias,
                new CdnImageValue { Url = url, AltText = altText }, saveMode);

        public static Task<bool> SetAndPublish(Guid contentId, string propertyAlias,
            CdnImageValue value)
            => _service.CdnImage.SetAndPublishAsync(contentId, propertyAlias, value);

        public static Task<bool> Update(Guid contentId, string propertyAlias,
            Func<CdnImageValue, CdnImageValue> update, SaveMode saveMode = SaveMode.Draft)
            => _service.CdnImage.UpdateAsync(contentId, propertyAlias, update, saveMode);

        public static Task<bool> Clear(Guid contentId, string propertyAlias)
            => _service.CdnImage.ClearAsync(contentId, propertyAlias);
    }
}

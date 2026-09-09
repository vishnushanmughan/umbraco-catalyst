using Umbraco.Community.Catalyst.DataTypes.CdnImage;
using Umbraco.Community.Catalyst.DataTypes.StarRating;

namespace Umbraco.Community.Catalyst.Services;

/// <summary>
/// Root Catalyst service. Inject this single interface to access the Catalyst data types.
///
/// Usage:
/// <code>
/// public class MyController : Controller
/// {
///     private readonly ICatalystContentService _catalyst;
///
///     public MyController(ICatalystContentService catalyst)
///         =&gt; _catalyst = catalyst;
///
///     public async Task MyAction()
///     {
///         var rating = await _catalyst.StarRating.GetAsync(pageId, "productRating");
///         await _catalyst.StarRating.SetAsync(pageId, "productRating",
///             new StarRatingValue { Rating = 4.5m, MaxStars = 5 });
///     }
/// }
/// </code>
/// </summary>
public interface ICatalystContentService
{
    /// <summary>Read and write Star Rating properties.</summary>
    ICatalystDataTypeService<StarRatingValue> StarRating { get; }

    /// <summary>Read and write CDN Image properties.</summary>
    ICatalystDataTypeService<CdnImageValue> CdnImage { get; }

}

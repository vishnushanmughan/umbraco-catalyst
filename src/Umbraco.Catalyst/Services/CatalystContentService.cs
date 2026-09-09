using Umbraco.Community.Catalyst.DataTypes.CdnImage;
using Umbraco.Community.Catalyst.DataTypes.StarRating;
using Umbraco.Cms.Core.PublishedCache;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Web;

namespace Umbraco.Community.Catalyst.Services;

/// <summary>
/// Concrete implementation of ICatalystContentService.
/// Wires the Catalyst typed data type services together into one injectable root service.
/// Registered as Scoped in CatalystComposer.
/// </summary>
internal sealed class CatalystContentService : ICatalystContentService
{
    public ICatalystDataTypeService<StarRatingValue> StarRating { get; }
    public ICatalystDataTypeService<CdnImageValue> CdnImage { get; }

    public CatalystContentService(
        IContentService contentService,
        IPublishedContentCache publishedCache,
        IUmbracoContextFactory contextFactory,
        IDataTypeService dataTypeService)
    {
        // One generic service instance per data type.
        // Each retained data type uses the same implementation - only TValue differs.
        StarRating = new CatalystDataTypeService<StarRatingValue>(contentService, publishedCache, contextFactory, dataTypeService);
        CdnImage = new CatalystDataTypeService<CdnImageValue>(contentService, publishedCache, contextFactory, dataTypeService);
    }
}

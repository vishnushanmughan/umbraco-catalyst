# Umbraco Catalyst

Catalyst property editors and backoffice extensions for Umbraco CMS 17+, packaged as
a single NuGet package: `Umbraco.Catalyst`.

Install the package and the Catalyst data types appear immediately in the backoffice under
**Settings → Data Types → Create New**. No `appsettings.json` or `Program.cs` changes
required.

## Data Types

| Alias                 | Name        |
| --------------------- | ----------- |
| `Catalyst.StarRating` | Star Rating |
| `Catalyst.CdnImage`   | CDN Image   |

The package also includes **Catalyst TipTap Emoji**, a searchable emoji toolbar
extension for Umbraco's TipTap Rich Text Editor.

## Solution structure

```
Umbraco.Catalyst.slnx
src/
  Umbraco.Catalyst/            Razor Class Library (net10.0)
    Core/                      Shared abstractions (ICatalystValue, CatalystValueBase, ICatalystConfiguration)
    DataTypes/                 StarRating and CdnImage data types
    Models/                    SaveMode, CatalystSetRequest, CatalystSetResponse
    Services/                  ICatalystContentService + ICatalystDataTypeService<T> (typed CRUD per data type)
    Facade/                    Catalyst.cs - static fluent shorthand over the service layer
    Api/                       CatalystApiController (full CRUD endpoints)
    Composers/                 CatalystComposer (DI registration + static facade bootstrap)
    wwwroot/UmbracoCatalyst/   umbraco-package.json + built backoffice bundle (catalyst.js)
    client/                    TypeScript/Lit source for the retained editors and TipTap Emoji
tests/
  Umbraco.Catalyst.Tests/      xUnit tests for value models and converters
```

## Zero-config packaging

The project is a **Razor Class Library** with `StaticWebAssetBasePath=App_Plugins`, so
`wwwroot/UmbracoCatalyst/*` (the `umbraco-package.json` manifest + compiled client assets)
is automatically served at `/App_Plugins/UmbracoCatalyst/...` by the consuming site's own
static file pipeline — no manual file copying, no config changes.

All `[DataEditor]` and `IPropertyValueConverter` classes are auto-discovered by Umbraco.
`CatalystComposer` registers the service layer (`ICatalystContentService`, scoped) and
a hosted service that initialises the static `Catalyst` facade on startup.

## Building

```powershell
dotnet build
dotnet test
```

Packing (`dotnet pack`) automatically runs `npm install` + `npm run build` inside
`src/Umbraco.Catalyst/client` first, so the backoffice bundle is always up to date in
the resulting `.nupkg`.

## Reading values in Razor

```csharp
@using Umbraco.Catalyst.Core.Extensions
@using Umbraco.Catalyst.DataTypes.StarRating

var rating = Model.CatalystValue<StarRatingValue>("myRatingProperty");
if (rating?.HasValue == true)
{
    <p>@rating.Rating / @rating.MaxStars</p>
}
```

## Reading and writing values in C#

Three equivalent ways to read/write Catalyst values programmatically:

**1. Injected service** (`ICatalystContentService`, scoped per request):

```csharp
var rating = await _catalyst.StarRating.GetAsync(pageId, "productRating");
await _catalyst.StarRating.SetAsync(pageId, "productRating",
    new StarRatingValue { Rating = 4.5m, MaxStars = 5 }, SaveMode.SaveAndPublish);
```

**2. Static fluent facade** (`using Umbraco.Catalyst;`):

```csharp
await Catalyst.StarRating.Set(pageId, "productRating", rating: 5m, maxStars: 5);
```

**3. REST API** (`/umbraco/catalyst/api/v1`):

```http
GET    /umbraco/catalyst/api/v1/content/{contentId}/property/{propertyAlias}
GET    /umbraco/catalyst/api/v1/content/{contentId}/properties
POST   /umbraco/catalyst/api/v1/content/{contentId}/property/{propertyAlias}
DELETE /umbraco/catalyst/api/v1/content/{contentId}/property/{propertyAlias}
GET    /umbraco/catalyst/api/v1/health
```

`SaveMode` controls what happens after a write: `Draft` (default, no publish),
`SaveAndPublish` (saves and publishes immediately), or `SaveOnly` (persists the draft
revision only).

# Star Rating

`Catalyst.StarRating` stores a rating as JSON and renders a configurable star selector in the Umbraco backoffice.

![Star Rating editor](screenshots/Rating.png)

## Configuration

Create a data type using the `Catalyst.StarRating` editor. Configure:

- `maxStars`: maximum rating, default `5`.
- `allowHalfStars`: allow values such as `3.5`, default `true`.
- `allowZero`: allow `0` to represent no rating, default `true`.

## Stored value

A value retrieved through a converter is `StarRatingValue`:

```json
{
  "rating": 4.5,
  "maxStars": 5,
  "allowHalfStars": true
}
```

`HasValue` is `true` when `Rating` is greater than zero. Empty values return `StarRatingValue.Empty`.

## Razor usage

```csharp
@using Phases.Umbraco.Community.Catalyst.Core.Extensions
@using Phases.Umbraco.Community.Catalyst.DataTypes.StarRating

@{
    var rating = Model.CatalystValue<StarRatingValue>("productRating");
}

@if (rating?.HasValue == true)
{
    <span>@rating.Rating / @rating.MaxStars</span>
}
```

## Schema.org output

`StarRatingValue` provides `ToMinimalSchema(string itemName)` and `ToFullSchema(string itemName, StarRatingSchemaOptions? options = null)`. These return an HTML `script` element containing JSON-LD, or an empty string when no rating exists.

```csharp
@using Phases.Umbraco.Community.Catalyst.Core.Extensions
@using Phases.Umbraco.Community.Catalyst.DataTypes.StarRating

@{
    var rating = Model.CatalystValue<StarRatingValue>("productRating");
}

@if (rating?.HasValue == true)
{
    @Html.Raw(rating.ToMinimalSchema("Example product"))
}
```

## Create or update through API

The authenticated Catalyst API accepts a Star Rating value through:

```http
POST /umbraco/catalyst/api/v1/content/{contentId}/property/productRating
Content-Type: application/json
```

```json
{
  "editorAlias": "Catalyst.StarRating",
  "value": {
    "rating": 4.5
  },
  "saveMode": "Draft"
}
```

The API validates the requested rating against the data type configuration. See [API documentation](api.md) for authentication, response format, and other endpoints.

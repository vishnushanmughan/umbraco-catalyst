# Catalyst API

Catalyst exposes authenticated backoffice endpoints under `/umbraco/catalyst/api/v1`.

All endpoints require an authenticated request. Use Umbraco backoffice authentication, and do not expose these endpoints directly to anonymous frontend clients.

## Health

```http
GET /umbraco/catalyst/api/v1/health
```

Example response:

```json
{
  "status": "ok",
  "package": "Phases.Umbraco.Community.Catalyst",
  "version": "1.0.13",
  "dataTypes": [
    "Catalyst.StarRating",
    "Catalyst.CdnImage"
  ]
}
```

## Read one property

```http
GET /umbraco/catalyst/api/v1/content/{contentId}/property/{propertyAlias}
```

Example response:

```json
{
  "contentId": "00000000-0000-0000-0000-000000000001",
  "propertyAlias": "productRating",
  "editorAlias": "Catalyst.StarRating",
  "value": {
    "rating": 4.5,
    "maxStars": 5,
    "allowHalfStars": true
  },
  "hasValue": true
}
```

## Read all Catalyst properties

```http
GET /umbraco/catalyst/api/v1/content/{contentId}/properties
```

Example response:

```json
{
  "contentId": "00000000-0000-0000-0000-000000000001",
  "properties": [
    {
      "alias": "productRating",
      "editorAlias": "Catalyst.StarRating",
      "value": {
        "rating": 4.5,
        "maxStars": 5,
        "allowHalfStars": true
      },
      "hasValue": true
    },
    {
      "alias": "heroImage",
      "editorAlias": "Catalyst.CdnImage",
      "value": {
        "url": "https://cdn.example.com/images/hero.jpg",
        "altText": "Product displayed on a white background"
      },
      "hasValue": true
    }
  ]
}
```

## Create or update a property

```http
POST /umbraco/catalyst/api/v1/content/{contentId}/property/{propertyAlias}
Content-Type: application/json
```

Request body:

```json
{
  "editorAlias": "Catalyst.StarRating",
  "value": {
    "rating": 4.5
  },
  "saveMode": "Draft"
}
```

Supported save modes:

- `Draft`: save without publishing.
- `SaveOnly`: persist the draft revision.
- `SaveAndPublish`: save, then publish all cultures.

Example response:

```json
{
  "contentId": "00000000-0000-0000-0000-000000000001",
  "propertyAlias": "productRating",
  "saved": true,
  "saveMode": "Draft",
  "savedValue": {
    "rating": 4.5,
    "maxStars": 5,
    "allowHalfStars": true
  },
  "message": "Value saved successfully."
}
```

For CDN Image, use `editorAlias` `Catalyst.CdnImage` and provide `url` and `altText` in `value`.

## Clear a property

```http
DELETE /umbraco/catalyst/api/v1/content/{contentId}/property/{propertyAlias}
```

Example response:

```json
{
  "contentId": "00000000-0000-0000-0000-000000000001",
  "propertyAlias": "heroImage",
  "cleared": true,
  "message": "Property 'heroImage' cleared successfully."
}
```

## Content delivery

For frontend or delivery reads, use Umbraco's Delivery API or published content APIs. Catalyst API endpoints require authentication and are intended for backoffice or trusted integration use.

# Umbraco Catalyst

> Useful, out-of-the-box property editors and backoffice extensions for Umbraco CMS.

## Overview

Umbraco Catalyst is a backend-extending package for Umbraco. It currently contains a small set of useful property editors and extensions designed to work out of the box. Catalyst will grow over time with more easy-to-use datatypes and backend features.

The package currently includes:

- [Star Rating](https://github.com/vishnushanmughan/umbraco-catalyst/blob/main/docs/star-rating.md), a configurable rating editor with optional half stars and Schema.org output helpers.
- [CDN Image](https://github.com/vishnushanmughan/umbraco-catalyst/blob/main/docs/cdn-image.md), an image URL and alt text editor for CDN-hosted images.
- [TipTap Emoji](https://github.com/vishnushanmughan/umbraco-catalyst/blob/main/docs/tiptap-emoji.md), a searchable emoji toolbar extension for Umbraco's TipTap Rich Text Editor.

## Features

- Native Umbraco data types discovered automatically after installation.
- Backoffice extensions served through Razor Class Library static web assets.
- Typed C# value models and value converters.
- Optional REST API for reading and writing Catalyst values.
- No `appsettings.json`, `Program.cs`, or manual `App_Plugins` copy required.

## Installation

Install from NuGet:

```powershell
dotnet add package Umbraco.Community.Catalyst
```

Or from Package Manager Console:

```powershell
Install-Package Umbraco.Community.Catalyst
```

After installation, open **Settings > Data Types > Create New**. Catalyst editors appear as `Catalyst.StarRating` and `Catalyst.CdnImage`. Configure a Rich Text Editor data type to add the TipTap Emoji action.

## Usage and configuration

### Property editors

| Editor | Alias | Documentation |
| --- | --- | --- |
| Star Rating | `Catalyst.StarRating` | [Configuration and code examples](https://github.com/vishnushanmughan/umbraco-catalyst/blob/main/docs/star-rating.md) |
| CDN Image | `Catalyst.CdnImage` | [Configuration and code examples](https://github.com/vishnushanmughan/umbraco-catalyst/blob/main/docs/cdn-image.md) |
| TipTap Emoji | `Catalyst.Tiptap.Emoji` | [Configuration and code examples](https://github.com/vishnushanmughan/umbraco-catalyst/blob/main/docs/tiptap-emoji.md) |

### Backend API

Catalyst exposes authenticated endpoints under `/umbraco/catalyst/api/v1`. See [API documentation](https://github.com/vishnushanmughan/umbraco-catalyst/blob/main/docs/api.md) for request, response, and datatype examples.

### C# value access

```csharp
@using Umbraco.Community.Catalyst.Core.Extensions
@using Umbraco.Community.Catalyst.DataTypes.StarRating

var rating = Model.CatalystValue<StarRatingValue>("productRating");
if (rating?.HasValue == true)
{
    <p>@rating.Rating / @rating.MaxStars</p>
}
```

## Documentation

- [Documentation overview](https://github.com/vishnushanmughan/umbraco-catalyst/tree/main/docs)
- [Star Rating](https://github.com/vishnushanmughan/umbraco-catalyst/blob/main/docs/star-rating.md)
- [CDN Image](https://github.com/vishnushanmughan/umbraco-catalyst/blob/main/docs/cdn-image.md)
- [TipTap Emoji](https://github.com/vishnushanmughan/umbraco-catalyst/blob/main/docs/tiptap-emoji.md)
- [Catalyst API](https://github.com/vishnushanmughan/umbraco-catalyst/blob/main/docs/api.md)

## Screenshots

### Property editors

![Catalyst property editors](https://raw.githubusercontent.com/vishnushanmughan/umbraco-catalyst/refs/heads/main/docs/screenshots/Editor%20Types.png)

![Star Rating](https://raw.githubusercontent.com/vishnushanmughan/umbraco-catalyst/refs/heads/main/docs/screenshots/Rating.png)

![CDN Image](https://raw.githubusercontent.com/vishnushanmughan/umbraco-catalyst/refs/heads/main/docs/screenshots/CDN.png)

### TipTap Emoji

![Open Rich Text Editor data type](https://raw.githubusercontent.com/vishnushanmughan/umbraco-catalyst/refs/heads/main/docs/screenshots/emoji-select.png)

![Add Emoji action to toolbar](https://raw.githubusercontent.com/vishnushanmughan/umbraco-catalyst/refs/heads/main/docs/screenshots/emoji-select-2.png)

![Emoji available in editor toolbar](https://raw.githubusercontent.com/vishnushanmughan/umbraco-catalyst/refs/heads/main/docs/screenshots/emoji-select-3.png) 

## Repository and support

- [Source repository](https://github.com/vishnushanmughan/umbraco-catalyst)
- [Issues](https://github.com/vishnushanmughan/umbraco-catalyst/issues)
- [Umbraco Marketplace](https://marketplace.umbraco.com/)

## License

Umbraco Catalyst is released under the [MIT License](https://github.com/vishnushanmughan/umbraco-catalyst/blob/main/LICENSE).
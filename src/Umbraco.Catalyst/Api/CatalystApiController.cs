using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using global::Phases.Umbraco.Community.Catalyst;
using global::Phases.Umbraco.Community.Catalyst.Core.Abstractions;
using global::Phases.Umbraco.Community.Catalyst.DataTypes.StarRating;
using global::Phases.Umbraco.Community.Catalyst.Models;
using CatalystJsonOptions = global::Phases.Umbraco.Community.Catalyst.Core.Abstractions.CatalystJsonOptions;
using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.PublishedCache;
using Umbraco.Cms.Core.Services;
using Umbraco.Extensions;

namespace Phases.Umbraco.Community.Catalyst.Api;

/// <summary>
/// API controller providing full CRUD access to Catalyst property values.
/// Base URL: /umbraco/catalyst/api/v1/
///
/// All endpoints require an authenticated request (backoffice cookie).
/// For frontend/delivery reads, rely on Umbraco's Delivery API + value converters.
/// </summary>
[ApiController]
[Authorize]
[Route("umbraco/catalyst/api/v1")]
public sealed class CatalystApiController : ControllerBase
{
    private readonly IPublishedContentCache _publishedCache;
    private readonly IContentService _contentService;
    private readonly IDataTypeService _dataTypeService;

    public CatalystApiController(
        IPublishedContentCache publishedCache,
        IContentService contentService,
        IDataTypeService dataTypeService)
    {
        _publishedCache = publishedCache;
        _contentService = contentService;
        _dataTypeService = dataTypeService;
    }

    /// <summary>
    /// Health check - confirms Catalyst is installed and lists registered data types.
    /// GET /umbraco/catalyst/api/v1/health
    /// </summary>
    [HttpGet("health")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult Health() => Ok(new
    {
        status = "ok",
        package = "Phases.Umbraco.Community.Catalyst",
        version = typeof(CatalystApiController).Assembly.GetName().Version?.ToString() ?? "unknown",
        dataTypes = new[]
        {
            "Catalyst.StarRating", "Catalyst.CdnImage"
        }
    });

    /// <summary>
    /// Returns the typed value of a single Catalyst property.
    /// GET /umbraco/catalyst/api/v1/content/{contentId}/property/{propertyAlias}
    /// </summary>
    [HttpGet("content/{contentId:guid}/property/{propertyAlias}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetProperty(Guid contentId, string propertyAlias)
    {
        var content = _publishedCache.GetById(contentId);
        if (content is null)
            return NotFound(new { error = $"Content {contentId} not found." });

        var property = content.GetProperty(propertyAlias);
        if (property is null)
            return NotFound(new { error = $"Property '{propertyAlias}' not found." });

        var value = content.Value(propertyAlias);

        return Ok(new
        {
            contentId,
            propertyAlias,
            editorAlias = property.PropertyType.EditorAlias,
            value,
            hasValue = (value as ICatalystValue)?.HasValue
        });
    }

    /// <summary>
    /// Returns all Catalyst property values on a content node.
    /// GET /umbraco/catalyst/api/v1/content/{contentId}/properties
    /// </summary>
    [HttpGet("content/{contentId:guid}/properties")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetAllProperties(Guid contentId)
    {
        var content = _publishedCache.GetById(contentId);
        if (content is null)
            return NotFound(new { error = $"Content {contentId} not found." });

        var properties = content.Properties
            .Where(p => p.PropertyType.EditorAlias.StartsWith("Catalyst.", StringComparison.OrdinalIgnoreCase))
            .Select(p => new
            {
                alias = p.Alias,
                editorAlias = p.PropertyType.EditorAlias,
                value = content.Value(p.Alias),
                hasValue = (content.Value(p.Alias) as ICatalystValue)?.HasValue
            });

        return Ok(new { contentId, properties });
    }

    /// <summary>
    /// Sets the Catalyst property value on a content node.
    /// Creates or completely replaces the existing value.
    ///
    /// Request body example for Star Rating:
    /// { "editorAlias": "Catalyst.StarRating", "value": { "rating": 4.5 }, "saveMode": "Draft" }
    ///
    /// POST /umbraco/catalyst/api/v1/content/{contentId}/property/{propertyAlias}
    /// </summary>
    [HttpPost("content/{contentId:guid}/property/{propertyAlias}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult SetProperty(Guid contentId, string propertyAlias, [FromBody] CatalystSetRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.EditorAlias))
            return BadRequest(new { error = "editorAlias is required." });

        if (request.Value is null)
            return BadRequest(new { error = "value is required." });

        var content = _contentService.GetById(contentId);
        if (content is null)
            return NotFound(new { error = $"Content {contentId} not found." });

        var property = content.Properties
            .FirstOrDefault(p => p.Alias.Equals(propertyAlias, StringComparison.OrdinalIgnoreCase));

        if (property is null)
            return NotFound(new { error = $"Property '{propertyAlias}' not found on this content type." });

        if (!property.PropertyType.PropertyEditorAlias.StartsWith("Catalyst.", StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { error = $"Property '{propertyAlias}' does not use a Catalyst editor." });

        if (!request.EditorAlias.Equals(property.PropertyType.PropertyEditorAlias, StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { error = $"editorAlias must match '{property.PropertyType.PropertyEditorAlias}'." });

        var value = request.Value;
        if (property.PropertyType.PropertyEditorAlias.Equals(StarRatingDataEditor.EditorAlias, StringComparison.OrdinalIgnoreCase))
        {
            var validation = GetStarRatingValue(property, request.Value);
            if (validation.Error is not null)
                return BadRequest(new { error = validation.Error });

            value = JsonSerializer.SerializeToNode(validation.Value, CatalystJsonOptions.CamelCase)!;
        }

        var json = value.ToJsonString(CatalystJsonOptions.CamelCase);
        content.SetValue(propertyAlias, json);

        var saved = ApplySaveMode(content, request.SaveMode);

        var savedContent = _publishedCache.GetById(contentId);
        var savedValue = savedContent?.Value(propertyAlias);

        return Ok(new global::Phases.Umbraco.Community.Catalyst.Models.CatalystSetResponse
        {
            ContentId = contentId,
            PropertyAlias = propertyAlias,
            Saved = saved,
            SaveMode = request.SaveMode.ToString(),
            SavedValue = savedValue,
            Message = saved ? "Value saved successfully." : "Save failed."
        });
    }

    private (StarRatingValue? Value, string? Error) GetStarRatingValue(
        IProperty property,
        System.Text.Json.Nodes.JsonNode requestValue)
    {
        StarRatingRequestValue? requested;
        try
        {
            requested = requestValue.Deserialize<StarRatingRequestValue>(CatalystJsonOptions.CamelCase);
        }
        catch (JsonException)
        {
            return (null, "Star Rating value must contain a numeric rating.");
        }

        if (requested is null)
            return (null, "Star Rating value must contain a numeric rating.");

        var dataType = _dataTypeService.GetDataType(property.PropertyType.DataTypeId);
        if (dataType is null)
            return (null, "Star Rating data type configuration was not found.");

        StarRatingConfiguration configuration;
        try
        {
            configuration = JsonSerializer.Deserialize<StarRatingConfiguration>(
                JsonSerializer.Serialize(dataType.ConfigurationData),
                CatalystJsonOptions.CamelCase) ?? new StarRatingConfiguration();
        }
        catch (JsonException)
        {
            return (null, "Star Rating data type configuration is invalid.");
        }

        var maxStars = configuration.MaxStars > 0 ? configuration.MaxStars : 5;
        if (requested.Rating > maxStars)
            return (null, $"Rating must not exceed maximum allowed rating of {maxStars}.");

        if (requested.Rating < 0 || (!configuration.AllowZero && requested.Rating == 0))
            return (null, configuration.AllowZero
                ? "Rating must not be negative."
                : "Rating must be greater than zero.");

        if (!configuration.AllowHalfStars && requested.Rating % 1 != 0)
            return (null, "Half-star ratings are not allowed for this property.");

        if (configuration.AllowHalfStars && requested.Rating % 0.5m != 0)
            return (null, "Rating must use whole-star or half-star increments.");

        return (new StarRatingValue
        {
            Rating = requested.Rating,
            MaxStars = maxStars,
            AllowHalfStars = configuration.AllowHalfStars
        }, null);
    }

    /// <summary>
    /// Clears the Catalyst property value on a content node.
    /// The property remains on the document type - only its value is removed.
    /// Saves as draft - does NOT auto-publish the cleared state.
    ///
    /// DELETE /umbraco/catalyst/api/v1/content/{contentId}/property/{propertyAlias}
    /// </summary>
    [HttpDelete("content/{contentId:guid}/property/{propertyAlias}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult ClearProperty(Guid contentId, string propertyAlias)
    {
        var content = _contentService.GetById(contentId);
        if (content is null)
            return NotFound(new { error = $"Content {contentId} not found." });

        content.SetValue(propertyAlias, null);
        _contentService.Save(content);

        return Ok(new
        {
            contentId,
            propertyAlias,
            cleared = true,
            message = $"Property '{propertyAlias}' cleared successfully."
        });
    }

    /// <summary>
    /// <summary>
    /// Applies the requested save mode. SaveAndPublish saves then publishes all cultures;
    /// Draft and SaveOnly both persist a draft revision (IContentService in v17+ no longer
    /// exposes a raiseEvents override on Save).
    /// </summary>
    private bool ApplySaveMode(IContent content, SaveMode mode)
    {
        try
        {
            var saveResult = _contentService.Save(content);
            if (!saveResult.Success) return false;

            if (mode != SaveMode.SaveAndPublish) return true;

            // IContentService.Publish only exposes an int userId overload; SuperUserKey has no sync equivalent yet.
#pragma warning disable CS0618
            var publishResult = _contentService.Publish(content, ["*"], Constants.Security.SuperUserId);
#pragma warning restore CS0618
            return publishResult.Success;
        }
        catch
        {
            return false;
        }
    }

    private sealed record StarRatingRequestValue(decimal Rating);
}


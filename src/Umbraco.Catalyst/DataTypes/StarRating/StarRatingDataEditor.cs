using Umbraco.Cms.Core.PropertyEditors;

namespace Phases.Umbraco.Community.Catalyst.DataTypes.StarRating;

/// <summary>
/// Registers the Catalyst Star Rating property editor schema with Umbraco.
/// This makes "Catalyst Star Rating" appear in Settings to Data Types to Create New.
/// The UI is handled by the Web Component registered in umbraco-package.json.
/// </summary>
[DataEditor(StarRatingDataEditor.EditorAlias, ValueType = ValueTypes.Json)]
public sealed class StarRatingDataEditor : DataEditor
{
    /// <summary>Unique alias. Used by the value converter to identify this editor.</summary>
    public const string EditorAlias = "Catalyst.StarRating";

    public StarRatingDataEditor(IDataValueEditorFactory dataValueEditorFactory)
        : base(dataValueEditorFactory)
    {
    }
}

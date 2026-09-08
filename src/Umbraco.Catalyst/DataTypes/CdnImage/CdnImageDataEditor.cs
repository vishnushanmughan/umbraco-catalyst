using Umbraco.Cms.Core.PropertyEditors;

namespace Umbraco.Catalyst.DataTypes.CdnImage;

[DataEditor(CdnImageDataEditor.EditorAlias, ValueType = ValueTypes.Json)]
public sealed class CdnImageDataEditor : DataEditor
{
    public const string EditorAlias = "Catalyst.CdnImage";

    public CdnImageDataEditor(IDataValueEditorFactory dataValueEditorFactory)
        : base(dataValueEditorFactory) { }
}

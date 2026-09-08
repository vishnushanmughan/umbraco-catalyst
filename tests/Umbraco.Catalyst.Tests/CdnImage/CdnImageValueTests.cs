using Umbraco.Catalyst.DataTypes.CdnImage;
using Xunit;

namespace Umbraco.Catalyst.Tests.CdnImage;

public class CdnImageValueTests
{
    [Fact]
    public void HasValue_WhenUrlIsEmpty_ReturnsFalse()
    {
        Assert.False(CdnImageValue.Empty.HasValue);
    }

    [Fact]
    public void HasValue_WhenUrlIsSet_ReturnsTrue()
    {
        var value = new CdnImageValue { Url = "https://cdn.example.com/image.jpg" };
        Assert.True(value.HasValue);
    }

    [Fact]
    public void ToImgTag_WhenHasValue_ReturnsImgElement()
    {
        var value = new CdnImageValue { Url = "https://cdn.example.com/image.jpg", AltText = "Test" };
        Assert.Contains("<img", value.ToImgTag());
        Assert.Contains("alt=\"Test\"", value.ToImgTag());
    }

    [Fact]
    public void ToImgTag_WhenEmpty_ReturnsEmptyString()
    {
        Assert.Equal(string.Empty, CdnImageValue.Empty.ToImgTag());
    }
}

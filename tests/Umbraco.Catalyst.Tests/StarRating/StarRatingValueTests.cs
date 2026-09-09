using Phases.Umbraco.Community.Catalyst.DataTypes.StarRating;
using Xunit;

namespace Phases.Umbraco.Community.Catalyst.Tests.StarRating;

public class StarRatingValueTests
{
    [Fact]
    public void HasValue_WhenRatingIsZero_ReturnsFalse()
    {
        var value = StarRatingValue.Empty;
        Assert.False(value.HasValue);
    }

    [Theory]
    [InlineData(1)]
    [InlineData(3.5)]
    [InlineData(5)]
    public void HasValue_WhenRatingIsPositive_ReturnsTrue(decimal rating)
    {
        var value = new StarRatingValue { Rating = rating, MaxStars = 5 };
        Assert.True(value.HasValue);
    }

    [Fact]
    public void ToString_WhenHasValue_ReturnsReadableString()
    {
        var value = new StarRatingValue { Rating = 4.5m, MaxStars = 5 };
        Assert.Equal("4.5 out of 5 stars", value.ToString());
    }

    [Fact]
    public void ToString_WhenEmpty_ReturnsNoRating()
    {
        Assert.Equal("No rating", StarRatingValue.Empty.ToString());
    }
}

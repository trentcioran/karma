using NUnit.Framework;

namespace Karma.Core.Test.Metadata.Heuristics
{
    [TestFixture]
    public class ConstructorHeuristicFixture
    {
        [Test]
        public void WithNoConstructorTest()
        {
            Assert.Fail();
        }

        [Test]
        public void WithNoPublicConstructorTest()
        {
            Assert.Fail();
        }

        [Test]
        public void WithPublicConstructorTest()
        {
            Assert.Fail();
        }
    }
}
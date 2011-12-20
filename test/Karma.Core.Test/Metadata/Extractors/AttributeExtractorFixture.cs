using System;
using Karma.Core.ClassAnalyzerSample;
using Karma.Core.Metadata;
using Karma.Core.Metadata.Extractors;
using Karma.Core.Metadata.Heuristics;
using NUnit.Framework;

namespace Karma.Core.Test.Metadata.Extractors
{
    [TestFixture]
    public class AttributeExtractorFixture : ExtractorFixtureBase<AttributeHeuristic>
    {
        [Test]
        public void WithNoAttributesTest()
        {
            AttributeExtractor extractor = new AttributeExtractor(Heuristic);
            Type type = typeof (Simple);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, Heuristics);

            Assert.That(metadata.Attributes, Is.Empty);
        }

        [Test]
        public void WithNoAttributesWithNoHeuristicsTest()
        {
            AttributeExtractor extractor = new AttributeExtractor(Heuristic);
            Type type = typeof(Simple);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, EmptyHeuristics);

            Assert.That(metadata.Attributes, Is.Empty);
        }

        [Test]
        public void WithSelectableAttributesTest()
        {
            AttributeExtractor extractor = new AttributeExtractor(Heuristic);
            Type type = typeof(WithAttribute);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, EmptyHeuristics);

            Assert.That(metadata.Attributes, Is.Not.Empty);
        }

        [Test]
        public void WithSelectableAttributesWithNoHeuristicsTest()
        {
            AttributeExtractor extractor = new AttributeExtractor(Heuristic);
            Type type = typeof(WithAttribute);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, EmptyHeuristics);

            Assert.That(metadata.Attributes, Is.Not.Empty);
        }

    }
}

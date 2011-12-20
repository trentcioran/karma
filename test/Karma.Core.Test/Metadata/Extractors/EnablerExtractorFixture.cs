using System;
using Karma.Core.ClassAnalyzerSample;
using Karma.Core.Metadata;
using Karma.Core.Metadata.Extractors;
using Karma.Core.Metadata.Heuristics;
using NUnit.Framework;

namespace Karma.Core.Test.Metadata.Extractors
{
    [TestFixture]
    public class EnablerExtractorFixture : ExtractorFixtureBase<EnablerHeuristic>
    {
        [Test]
        public void WithNoEnablersTest()
        {
            EnablerExtractor extractor = new EnablerExtractor(Heuristic);
            Type type = typeof(Simple);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, Heuristics);

            Assert.That(metadata.Enablers, Is.Empty);
        }

        [Test]
        public void WithNoEnablersWithNoHeuristicsTest()
        {
            EnablerExtractor extractor = new EnablerExtractor(Heuristic);
            Type type = typeof(Simple);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, EmptyHeuristics);

            Assert.That(metadata.Enablers, Is.Empty);
        }

        [Test]
        public void WithEnablersTest()
        {
            EnablerExtractor extractor = new EnablerExtractor(Heuristic);
            Type type = typeof(WithEnabler);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, Heuristics);

            Assert.That(metadata.Enablers, Is.Not.Empty);
        }

        [Test]
        public void WithEnablersWithNoHeuristicsTest()
        {
            EnablerExtractor extractor = new EnablerExtractor(Heuristic);
            Type type = typeof(WithEnabler);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, EmptyHeuristics);

            Assert.That(metadata.Enablers, Is.Not.Empty);
        }
    }
}
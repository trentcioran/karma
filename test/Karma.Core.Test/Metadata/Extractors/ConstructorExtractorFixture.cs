using System;
using Karma.Core.ClassAnalyzerSample;
using Karma.Core.Metadata;
using Karma.Core.Metadata.Extractors;
using Karma.Core.Metadata.Heuristics;
using NUnit.Framework;

namespace Karma.Core.Test.Metadata.Extractors
{
    [TestFixture]
    public class ConstructorExtractorFixture : ExtractorFixtureBase<ConstructorHeuristic>
    {
        [Test]
        public void WithNoConstructorTest()
        {
            ConstructorExtractor extractor = new ConstructorExtractor(Heuristic);
            Type type = typeof(Simple);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, Heuristics);

            Assert.That(metadata.Constructors, Is.Not.Empty);
        }

        [Test]
        public void WithNoConstructorWithEmptyHeuristicsTest()
        {
            ConstructorExtractor extractor = new ConstructorExtractor(Heuristic);
            Type type = typeof(Simple);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, EmptyHeuristics);

            Assert.That(metadata.Constructors, Is.Not.Empty);
        }

        [Test]
        public void WithNoPublicConstructorTest()
        {
            ConstructorExtractor extractor = new ConstructorExtractor(Heuristic);
            Type type = typeof(WithPrivayeConstructor);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, Heuristics);

            Assert.That(metadata.Constructors, Is.Empty);
        }

        [Test]
        public void WithPublicConstructorTest()
        {
            ConstructorExtractor extractor = new ConstructorExtractor(Heuristic);
            Type type = typeof(WithPrivayeConstructor);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, EmptyHeuristics);

            Assert.That(metadata.Constructors, Is.Empty);
        }
    }
}
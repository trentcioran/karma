using System;
using Karma.Core.ClassAnalyzerSample;
using Karma.Core.Metadata;
using Karma.Core.Metadata.Extractors;
using Karma.Core.Metadata.Heuristics;
using NUnit.Framework;

namespace Karma.Core.Test.Metadata.Extractors
{
    [TestFixture]
    public class OperationExtractorFixture : ExtractorFixtureBase<OperationsHeuristic>
    {
        [Test]
        public void WithNoOperationsTest()
        {
            OperationExtractor extractor = new OperationExtractor(Heuristic);
            Type type = typeof(Simple);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, Heuristics);

            Assert.That(metadata.Operations, Is.Empty);
        }

        [Test]
        public void WithOperationsTest()
        {
            OperationExtractor extractor = new OperationExtractor(Heuristic);
            Type type = typeof(WithOperation);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, Heuristics);

            Assert.That(metadata.Operations, Is.Not.Empty);
        }

        [Test]
        public void WithOperationsWithNoHeuristicsTest()
        {
            OperationExtractor extractor = new OperationExtractor(Heuristic);
            Type type = typeof(WithOperation);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, EmptyHeuristics);

            Assert.That(metadata.Operations, Is.Not.Empty);
        }

        [Test]
        public void WithEnablerMethodTest()
        {
            OperationExtractor extractor = new OperationExtractor(Heuristic);
            Type type = typeof(WithEnabler);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, Heuristics);

            Assert.That(metadata.Operations, Is.Empty);
        }

        [Test]
        public void WithEnablerMethodWithNoHeuristicsTest()
        {
            OperationExtractor extractor = new OperationExtractor(Heuristic);
            Type type = typeof(WithEnabler);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, EmptyHeuristics);

            Assert.That(metadata.Operations, Is.Not.Empty);
        }

        [Test]
        public void WithValidatorMethodTest()
        {
            OperationExtractor extractor = new OperationExtractor(Heuristic);
            Type type = typeof(WithValidator);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, Heuristics);

            Assert.That(metadata.Operations, Is.Empty);
        }

        [Test]
        public void WithValidatorMethodWithNoHeuristicsTest()
        {
            OperationExtractor extractor = new OperationExtractor(Heuristic);
            Type type = typeof(WithValidator);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, EmptyHeuristics);

            Assert.That(metadata.Operations, Is.Not.Empty);
        }
    }
}
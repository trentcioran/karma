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
            Assert.Fail();
        }

        [Test]
        public void WithEnablerMethodTest()
        {
            Assert.Fail();
        }

        [Test]
        public void WithValidatorMethodTest()
        {
            Assert.Fail();
        }
    }
}
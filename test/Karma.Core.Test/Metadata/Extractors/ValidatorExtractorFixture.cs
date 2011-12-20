using System;
using Karma.Core.ClassAnalyzerSample;
using Karma.Core.Metadata;
using Karma.Core.Metadata.Extractors;
using Karma.Core.Metadata.Heuristics;
using NUnit.Framework;

namespace Karma.Core.Test.Metadata.Extractors
{
    [TestFixture]
    public class ValidatorExtractorFixture : ExtractorFixtureBase<ValidatorHeuristic>
    {
        [Test]
        public void WithNoValidatorsTest()
        {
            ValidatorExtractor extractor = new ValidatorExtractor(Heuristic);
            Type type = typeof(Simple);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, Heuristics);

            Assert.That(metadata.Validators, Is.Empty);
        }

        [Test]
        public void WithValidatorsTest()
        {
            ValidatorExtractor extractor = new ValidatorExtractor(Heuristic);
            Type type = typeof(WithValidator);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, Heuristics);

            Assert.That(metadata.Validators, Is.Not.Empty);
        }
    }
}
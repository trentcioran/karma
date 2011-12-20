using System;
using Karma.Core.ClassAnalyzerSample;
using Karma.Core.Metadata;
using Karma.Core.Metadata.Extractors;
using Karma.Core.Metadata.Heuristics;
using NUnit.Framework;

namespace Karma.Core.Test.Metadata.Extractors
{
    [TestFixture]
    public class ContractExtractorFixture : ExtractorFixtureBase<ContractHeuristic>
    {
        [Test]
        public void WithNoContractTest()
        {
            ContractExtractor extractor = new ContractExtractor(Heuristic);
            Type type = typeof(Simple);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, Heuristics);

            Assert.That(metadata.Contracts, Is.Empty);
        }

        [Test]
        public void WithNoContractWithEmptyHeuristicsTest()
        {
            ContractExtractor extractor = new ContractExtractor(Heuristic);
            Type type = typeof(Simple);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, EmptyHeuristics);

            Assert.That(metadata.Contracts, Is.Empty);
        }

        [Test]
        public void WithContractTest()
        {
            ContractExtractor extractor = new ContractExtractor(Heuristic);
            Type type = typeof(DependencyContractImpl);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, Heuristics);

            Assert.That(metadata.Contracts, Is.Not.Empty);
        }

        [Test]
        public void WithContractWithEmptyHeuristicsTest()
        {
            ContractExtractor extractor = new ContractExtractor(Heuristic);
            Type type = typeof(DependencyContractImpl);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, EmptyHeuristics);

            Assert.That(metadata.Contracts, Is.Not.Empty);
        }

        [Test]
        public void WithIgnoredContractTest()
        {
            ContractExtractor extractor = new ContractExtractor(Heuristic);
            Type type = typeof(ImplementsClonable);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, Heuristics);

            Assert.That(metadata.Contracts, Is.Empty);
        }

        [Test]
        public void WithIgnoredContractWithEmptyHeuristicsTest()
        {
            ContractExtractor extractor = new ContractExtractor(Heuristic);
            Type type = typeof(ImplementsClonable);
            ClassMetadata metadata = new ClassMetadata(type);

            extractor.Extract(type, metadata, EmptyHeuristics);

            Assert.That(metadata.Contracts, Is.Empty);
        }
    }
}
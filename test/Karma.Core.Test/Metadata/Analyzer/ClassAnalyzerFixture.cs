using System;
using System.Collections.Generic;
using Karma.Core.ClassAnalyzerSample;
using Karma.Core.Metadata;
using Karma.Core.Metadata.Analyzer;
using Karma.Core.Metadata.Extractors;
using Karma.Core.Metadata.Heuristics;
using NUnit.Framework;

namespace Karma.Core.Test.Metadata.Analyzer
{
    [TestFixture]
    public class ClassAnalyzerFixture
    {
        private IList<IExtractor> _extractors;
        private ClassAnalyzer _analyzer;
            
        [SetUp]
        public void SetUp()
        {
            _extractors = new List<IExtractor>
                              {
                                  new AttributeExtractor(new AttributeHeuristic()),
                                  new ConstructorExtractor(new ConstructorHeuristic()),
                                  new ContractExtractor(new ContractHeuristic()),
                                  new PropertyExtractor(new PropertyHeuristic()),
                                  new OperationExtractor(new OperationsHeuristic()),
                                  new ValidatorExtractor(new ValidatorHeuristic()),
                                  new EnablerExtractor(new EnablerHeuristic())
                              };
            _analyzer = new ClassAnalyzer(_extractors);
        }

        [Test]
        [ExpectedException(typeof(ArgumentException))]
        public void AnalyzeSimpleClassNoExtractorsTest()
        {
            new ClassAnalyzer(new List<IExtractor>());
        }

        [Test]
        public void AnalyzeSimpleClassTest()
        {
            ClassMetadata metadata = _analyzer.Analyze(typeof(Simple));

            AssertMetadataIsCorrect(metadata, "Simple", 1, 0, 3, 0, 0, 0, 0);
        }

        [Test]
        public void AnalyzeSimpleClassWithAttributesTest()
        {
            ClassMetadata metadata = _analyzer.Analyze(typeof(WithAttribute));

            AssertMetadataIsCorrect(metadata, "WithAttribute", 1, 1, 3, 0, 0, 0, 0);
        }

        [Test]
        public void AnalyzeSimpleClassWithConstructorTest()
        {
            ClassMetadata metadata = _analyzer.Analyze(typeof(WithConstructor));

            AssertMetadataIsCorrect(metadata, "WithConstructor", 1, 0, 3, 0, 0, 0, 0);
        }

        [Test]
        public void AnalyzeWithOperationsTest()
        {
            ClassMetadata metadata = _analyzer.Analyze(typeof(WithOperation));

            AssertMetadataIsCorrect(metadata, "WithOperation", 1, 0, 3, 1, 0, 0, 0);
        }

        [Test]
        public void AnalyzeWithValidatorMethodsTest()
        {
            ClassMetadata metadata = _analyzer.Analyze(typeof(WithValidator));

            AssertMetadataIsCorrect(metadata, "WithValidator", 1, 0, 3, 0, 1, 0, 0);
        }

        [Test]
        public void AnalyzeWithEnablersTest()
        {
            ClassMetadata metadata = _analyzer.Analyze(typeof(WithEnabler));

            AssertMetadataIsCorrect(metadata, "WithEnabler", 1, 0, 3, 0, 0, 1, 0);
        }

        [Test]
        public void AnalyzeWithInterfaceImplementationTest()
        {
            ClassMetadata metadata = _analyzer.Analyze(typeof(DependencyContractImpl));

            AssertMetadataIsCorrect(metadata, "DependencyContractImpl", 1, 0, 0, 1, 0, 0, 1);
        }

        [Test]
        public void AnalyzeWithInheritanceClassTest()
        {
            ClassMetadata metadata = _analyzer.Analyze(typeof(WithInheritance));

            AssertMetadataIsCorrect(metadata, "WithInheritance", 1, 0, 0, 1, 0, 0, 1);

            Assert.That(metadata.BaseType, Is.EqualTo(typeof(DependencyContractImpl)));
        }

        [TestCase(typeof(ImplementsClonable))]
        [TestCase(typeof(ImplementsDisposable))]
        [TestCase(typeof(ImplementsEquatable))]
        [TestCase(typeof(ImplementsSerializable))]
        public void AnalyzeImplementsSystemNamespaceContractTest(Type typeToCheck)
        {
            ClassMetadata metadata = _analyzer.Analyze(typeToCheck);

            AssertMetadataIsCorrect(metadata, typeToCheck.Name, 1, 0, 0, 0, 0, 0, 0);
        }

        private void AssertMetadataIsCorrect(ClassMetadata metadata, string typeName, 
            int constructors, int attributes, int properties, int operations, int validators, 
            int enablers, int contracts)
        {
            Assert.That(metadata, Is.Not.Null);
            Assert.That(metadata.Name, Is.EqualTo(typeName));
            Assert.That(metadata.Attributes.Count, Is.EqualTo(attributes), "Attributes");
            Assert.That(metadata.Constructors.Count, Is.EqualTo(constructors), "Constructors");
            Assert.That(metadata.Properties.Count, Is.EqualTo(properties), "Properties");
            Assert.That(metadata.Operations.Count, Is.EqualTo(operations), "Operations");
            Assert.That(metadata.Validators.Count, Is.EqualTo(validators), "Validators");
            Assert.That(metadata.Enablers.Count, Is.EqualTo(enablers), "Enablers");
            Assert.That(metadata.Contracts.Count, Is.EqualTo(contracts), "Contracts");
        }
    }
}

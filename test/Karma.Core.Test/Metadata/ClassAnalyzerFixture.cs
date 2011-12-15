using System;
using Karma.Core.ClassAnalyzerSample;
using Karma.Core.Metadata;
using Karma.Core.Metadata.Analyzer;
using NUnit.Framework;

namespace Karma.Core.Test.Metadata
{
    [TestFixture]
    public class ClassAnalyzerFixture
    {
        [Test]
        public void AnalyzeSimpleClassTest()
        {
            ClassAnalyzer analyzer = new ClassAnalyzer();
            ClassMetadata metadata = analyzer.Analyze(typeof(Simple));

            Assert.That(metadata, Is.Not.Null);
            Assert.That(metadata.Name, Is.EqualTo("Simple"));
            Assert.That(metadata.Constructors, Is.Not.Empty);
            Assert.That(metadata.Constructors.Count, Is.EqualTo(1));
            Assert.That(metadata.Properties, Is.Not.Empty);
            Assert.That(metadata.Properties.Count, Is.EqualTo(3));
            Assert.That(metadata.Operations, Is.Empty);
            Assert.That(metadata.Validators, Is.Empty);
            Assert.That(metadata.Enablers, Is.Empty);
        }

        [Test]
        public void AnalyzeSimpleClassWithAttributesTest()
        {
            ClassAnalyzer analyzer = new ClassAnalyzer();
            ClassMetadata metadata = analyzer.Analyze(typeof(WithAttribute));

            Assert.That(metadata, Is.Not.Null);
            Assert.That(metadata.Name, Is.EqualTo("WithAttribute"));
            Assert.That(metadata.Constructors, Is.Not.Empty);
            Assert.That(metadata.Constructors.Count, Is.EqualTo(1));
            Assert.That(metadata.Properties, Is.Not.Empty);
            Assert.That(metadata.Properties.Count, Is.EqualTo(3));
            Assert.That(metadata.Operations, Is.Empty);
            Assert.That(metadata.Validators, Is.Empty);
            Assert.That(metadata.Enablers, Is.Empty);
        }

        [Test]
        public void AnalyzeSimpleClassWithConstructorTest()
        {
            ClassAnalyzer analyzer = new ClassAnalyzer();
            ClassMetadata metadata = analyzer.Analyze(typeof(WithConstructor));

            Assert.That(metadata, Is.Not.Null);
            Assert.That(metadata.Name, Is.EqualTo("WithConstructor"));
            Assert.That(metadata.Constructors, Is.Not.Empty);
            Assert.That(metadata.Constructors.Count, Is.EqualTo(1));
            Assert.That(metadata.Properties, Is.Not.Empty);
            Assert.That(metadata.Properties.Count, Is.EqualTo(3));
            Assert.That(metadata.Operations, Is.Empty);
            Assert.That(metadata.Validators, Is.Empty);
            Assert.That(metadata.Enablers, Is.Empty);
        }

        [Test]
        public void AnalyzeWithOperationsTest()
        {
            ClassAnalyzer analyzer = new ClassAnalyzer();
            ClassMetadata metadata = analyzer.Analyze(typeof(WithOperation));

            Assert.That(metadata, Is.Not.Null);
            Assert.That(metadata.Name, Is.EqualTo("WithOperation"));
            Assert.That(metadata.Constructors, Is.Not.Empty);
            Assert.That(metadata.Constructors.Count, Is.EqualTo(1));
            Assert.That(metadata.Properties, Is.Not.Empty);
            Assert.That(metadata.Properties.Count, Is.EqualTo(3));
            Assert.That(metadata.Operations, Is.Not.Empty);
            Assert.That(metadata.Operations.Count, Is.EqualTo(1));
            Assert.That(metadata.Validators, Is.Empty);
            Assert.That(metadata.Enablers, Is.Empty);
        }

        [Test]
        public void AnalyzeWithValidatorMethodsTest()
        {
            ClassAnalyzer analyzer = new ClassAnalyzer();
            ClassMetadata metadata = analyzer.Analyze(typeof(WithValidator));

            Assert.That(metadata, Is.Not.Null);
            Assert.That(metadata.Name, Is.EqualTo("WithValidator"));
            Assert.That(metadata.Constructors, Is.Not.Empty);
            Assert.That(metadata.Constructors.Count, Is.EqualTo(1));
            Assert.That(metadata.Properties, Is.Not.Empty);
            Assert.That(metadata.Properties.Count, Is.EqualTo(3));
            Assert.That(metadata.Operations, Is.Empty);
            Assert.That(metadata.Validators, Is.Not.Empty);
            Assert.That(metadata.Validators.Count, Is.EqualTo(1));
            Assert.That(metadata.Enablers, Is.Empty);
        }

        [Test]
        public void AnalyzeWithEnablersTest()
        {
            ClassAnalyzer analyzer = new ClassAnalyzer();
            ClassMetadata metadata = analyzer.Analyze(typeof(WithEnabler));

            Assert.That(metadata, Is.Not.Null);
            Assert.That(metadata.Name, Is.EqualTo("WithEnabler"));
            Assert.That(metadata.Constructors, Is.Not.Empty);
            Assert.That(metadata.Constructors.Count, Is.EqualTo(1));
            Assert.That(metadata.Properties, Is.Not.Empty);
            Assert.That(metadata.Properties.Count, Is.EqualTo(3));
            Assert.That(metadata.Operations, Is.Empty);
            Assert.That(metadata.Validators, Is.Empty);
            Assert.That(metadata.Enablers, Is.Not.Empty);
            Assert.That(metadata.Enablers.Count, Is.EqualTo(1));
        }

        [Test]
        public void AnalyzeWithInterfaceImplementationTest()
        {
            ClassAnalyzer analyzer = new ClassAnalyzer();
            ClassMetadata metadata = analyzer.Analyze(typeof(DependencyContractImpl));

            Assert.That(metadata, Is.Not.Null);
            Assert.That(metadata.Name, Is.EqualTo("DependencyContractImpl"));
            Assert.That(metadata.Constructors, Is.Not.Empty);
            Assert.That(metadata.Constructors.Count, Is.EqualTo(1));
            Assert.That(metadata.Properties, Is.Empty);
            Assert.That(metadata.Operations, Is.Not.Empty);
            Assert.That(metadata.Operations.Count, Is.EqualTo(1));
            Assert.That(metadata.Validators, Is.Empty);
            Assert.That(metadata.Enablers, Is.Empty);
            Assert.That(metadata.Contracts, Is.Not.Empty);
            Assert.That(metadata.Contracts.Count, Is.EqualTo(1));
        }

        [Test]
        public void AnalyzeWithInheritanceClassTest()
        {
            ClassAnalyzer analyzer = new ClassAnalyzer();
            ClassMetadata metadata = analyzer.Analyze(typeof(WithInheritance));

            Assert.That(metadata, Is.Not.Null);
            Assert.That(metadata.Name, Is.EqualTo("WithInheritance"));
            Assert.That(metadata.BaseType, Is.Not.Null);
            Assert.That(metadata.BaseType, Is.EqualTo(typeof(DependencyContractImpl)));
            Assert.That(metadata.Constructors, Is.Not.Empty);
            Assert.That(metadata.Constructors.Count, Is.EqualTo(1));
            Assert.That(metadata.Properties, Is.Empty);
            Assert.That(metadata.Operations, Is.Not.Empty);
            Assert.That(metadata.Operations.Count, Is.EqualTo(1));
            Assert.That(metadata.Validators, Is.Empty);
            Assert.That(metadata.Enablers, Is.Empty);
            Assert.That(metadata.Contracts, Is.Not.Empty);
            Assert.That(metadata.Contracts.Count, Is.EqualTo(1));
        }

        [TestCase(typeof(ImplementsClonable))]
        [TestCase(typeof(ImplementsDisposable))]
        [TestCase(typeof(ImplementsEquatable))]
        [TestCase(typeof(ImplementsSerializable))]
        public void AnalyzeImplementsSystemNamespaceContractTest(Type typeToCheck)
        {
            ClassAnalyzer analyzer = new ClassAnalyzer();
            ClassMetadata metadata = analyzer.Analyze(typeToCheck);

            Assert.That(metadata, Is.Not.Null);
            Assert.That(metadata.Constructors, Is.Not.Empty);
            Assert.That(metadata.Constructors.Count, Is.EqualTo(1));
            Assert.That(metadata.Properties, Is.Empty);
            Assert.That(metadata.Operations, Is.Empty);
            Assert.That(metadata.Validators, Is.Empty);
            Assert.That(metadata.Enablers, Is.Empty);
            Assert.That(metadata.Contracts, Is.Empty);
        }
    }
}

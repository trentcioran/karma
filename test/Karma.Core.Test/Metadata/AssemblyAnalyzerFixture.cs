using System.Reflection;
using Karma.Core.AssemblyAnalyzerSample;
using Karma.Core.Metadata;
using Karma.Core.Metadata.Analyzer;
using NUnit.Framework;
using Rhino.Mocks;

namespace Karma.Core.Test.Metadata
{
    [TestFixture]
    public class AssemblyAnalyzerFixture
    {
        [Test]
        public void AssemblyAnalisysTest()
        {
            Assembly assembly = Assembly.Load("Karma.Core.AssemblyAnalyzerSample");

            MockRepository repository = new MockRepository();

            IClassAnalyzer classAnalyzer = repository.StrictMock<IClassAnalyzer>();
            Expect.Call(classAnalyzer.Analyze(null))
                .IgnoreArguments()
                .Return(new ClassMetadata(typeof(User)))
                .Repeat.Twice();

            repository.ReplayAll();

            AssemblyAnalyzer analyzer = new AssemblyAnalyzer();
            analyzer.ClassAnalyzer = classAnalyzer;

            AssemblyMetadata metadata = analyzer.Analyze(assembly);

            Assert.That(metadata, Is.Not.Null);
            Assert.That(metadata.Attributes, Is.Not.Null);
            Assert.That(metadata.Attributes, Is.Not.Empty);
            Assert.That(metadata.Attributes.Count, Is.EqualTo(1));
            Assert.That(metadata.Classes, Is.Not.Null);
            Assert.That(metadata.Classes, Is.Not.Empty);
            Assert.That(metadata.Classes.Count, Is.EqualTo(2));

            repository.VerifyAll();
        }
    }
}

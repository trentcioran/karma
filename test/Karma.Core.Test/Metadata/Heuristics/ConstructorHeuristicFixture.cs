using System;
using System.Reflection;
using Karma.Core.ClassAnalyzerSample;
using Karma.Core.Metadata.Heuristics;
using NUnit.Framework;

namespace Karma.Core.Test.Metadata.Heuristics
{
    [TestFixture]
    public class ConstructorHeuristicFixture
    {
        [Test]
        public void WithNoConstructorTest()
        {
            ConstructorHeuristic heuristic = new ConstructorHeuristic();

            Type type = typeof(Simple);
            ConstructorInfo[] items = type.GetConstructors();

            bool selectable = heuristic.IsSelectable(items[0]);
            Assert.That(selectable, Is.True);
        }

        [Test]
        public void WithPublicConstructorTest()
        {
            ConstructorHeuristic heuristic = new ConstructorHeuristic();

            Type type = typeof(WithConstructor);
            ConstructorInfo[] items = type.GetConstructors();

            bool selectable = heuristic.IsSelectable(items[0]);
            Assert.That(selectable, Is.True);
        }
    }
}
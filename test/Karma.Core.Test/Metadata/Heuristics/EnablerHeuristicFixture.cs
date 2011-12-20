using System;
using System.Reflection;
using Karma.Core.ClassAnalyzerSample;
using Karma.Core.Metadata.Heuristics;
using NUnit.Framework;

namespace Karma.Core.Test.Metadata.Heuristics
{
    [TestFixture]
    public class EnablerHeuristicFixture
    {
        [Test]
        public void WithNoEnablersTest()
        {
            EnablerHeuristic heuristic = new EnablerHeuristic();
            Type type = typeof(WithOperation);
            MethodInfo[] methods = type.GetMethods();

            bool selectable = heuristic.IsSelectable(methods[0]);
            Assert.That(selectable, Is.False);
        }

        [Test]
        public void WithEnablersTest()
        {
            EnablerHeuristic heuristic = new EnablerHeuristic();
            Type type = typeof(WithEnabler);
            MethodInfo method = type.GetMethod("CanDoSomething");

            bool selectable = heuristic.IsSelectable(method);
            Assert.That(selectable, Is.True);
        }
    }
}
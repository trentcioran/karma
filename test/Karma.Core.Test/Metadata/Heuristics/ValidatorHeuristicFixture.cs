using System;
using System.Reflection;
using Karma.Core.ClassAnalyzerSample;
using Karma.Core.Metadata.Heuristics;
using NUnit.Framework;

namespace Karma.Core.Test.Metadata.Heuristics
{
    [TestFixture]
    public class ValidatorHeuristicFixture
    {
        [Test]
        public void WithNoValidatorsTest()
        {
            ValidatorHeuristic heuristic = new ValidatorHeuristic();
            Type type = typeof(Simple);
            MethodInfo[] methods = type.GetMethods();

            bool selectable = heuristic.IsSelectable(methods[0]);
            Assert.That(selectable, Is.False);
        }

        [Test]
        public void WithValidatorsTest()
        {
            ValidatorHeuristic heuristic = new ValidatorHeuristic();
            Type type = typeof(WithValidator);
            MethodInfo methods = type.GetMethod("SomethingIsValid");

            bool selectable = heuristic.IsSelectable(methods);
            Assert.That(selectable, Is.True);
        }
    }
}
using System;
using System.Reflection;
using Karma.Core.ClassAnalyzerSample;
using Karma.Core.Metadata.Heuristics;
using NUnit.Framework;

namespace Karma.Core.Test.Metadata.Heuristics
{
    [TestFixture]
    public class OperationHeuristicFixture
    {
        [Test]
        public void WithNoOperationsTest()
        {
            OperationsHeuristic heuristic = new OperationsHeuristic();
            Type type = typeof(Simple);
            MethodInfo[] methods = type.GetMethods();

            bool selectable = heuristic.IsSelectable(methods[0]);
            Assert.That(selectable, Is.False);
        }

        [Test]
        public void WithOperationsTest()
        {
            OperationsHeuristic heuristic = new OperationsHeuristic();
            Type type = typeof(WithOperation);
            MethodInfo method = type.GetMethod("DoSomething");

            bool selectable = heuristic.IsSelectable(method);
            Assert.That(selectable, Is.True);
        }

        [Test]
        public void WithEnablerMethodTest()
        {
            OperationsHeuristic heuristic = new OperationsHeuristic();
            Type type = typeof(WithEnabler);
            MethodInfo method = type.GetMethod("CanDoSomething");

            bool selectable = heuristic.IsSelectable(method);
            Assert.That(selectable, Is.True);
        }

        [Test]
        public void WithValidatorMethodTest()
        {
            OperationsHeuristic heuristic = new OperationsHeuristic();
            Type type = typeof(WithValidator);
            MethodInfo method = type.GetMethod("SomethingIsValid");

            bool selectable = heuristic.IsSelectable(method);
            Assert.That(selectable, Is.True);
        }

        [Test]
        public void EnablerPrecedenceOverOperations()
        {
            OperationsHeuristic heuristic = new OperationsHeuristic();
            EnablerHeuristic enablerHeuristic = new EnablerHeuristic();

            Type type = typeof(WithEnabler);
            MethodInfo method = type.GetMethod("CanDoSomething");

            bool hasPrecedence = enablerHeuristic.HasPrecedence(heuristic, method);
            Assert.That(hasPrecedence, Is.True);
        }

        [Test]
        public void ValidatorPrecedenceOverOperations()
        {
            OperationsHeuristic heuristic = new OperationsHeuristic();
            ValidatorHeuristic validatorHeuristic = new ValidatorHeuristic();

            Type type = typeof(WithValidator);
            MethodInfo method = type.GetMethod("SomethingIsValid");

            bool hasPrecedence = validatorHeuristic.HasPrecedence(heuristic, method);
            Assert.That(hasPrecedence, Is.True);
        }
    }
}

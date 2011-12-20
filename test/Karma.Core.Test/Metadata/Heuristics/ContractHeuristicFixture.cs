using System;
using Karma.Core.ClassAnalyzerSample;
using Karma.Core.Metadata.Heuristics;
using NUnit.Framework;

namespace Karma.Core.Test.Metadata.Heuristics
{
    [TestFixture]
    public class ContractHeuristicFixture
    {
        [Test]
        public void WithContractsTest()
        {
            ContractHeuristic heuristic = new ContractHeuristic();
            Type type = typeof(DependencyContractImpl);
            Type[] contracts = type.GetInterfaces();

            bool selectable = heuristic.IsSelectable(contracts[0]);
            Assert.That(selectable, Is.True);
        }

        [Test]
        public void WithIgnorableContractsTest()
        {
            ContractHeuristic heuristic = new ContractHeuristic();
            Type type = typeof(ImplementsClonable);
            Type[] contracts = type.GetInterfaces();

            bool selectable = heuristic.IsSelectable(contracts[0]);
            Assert.That(selectable, Is.False);
        }
    }
}
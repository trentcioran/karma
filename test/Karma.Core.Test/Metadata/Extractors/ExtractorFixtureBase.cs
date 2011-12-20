using System.Collections.Generic;
using System.Linq;
using Karma.Core.Metadata.Heuristics;
using NUnit.Framework;

namespace Karma.Core.Test.Metadata.Extractors
{
    public abstract class ExtractorFixtureBase<T>
        where T : ISelectorHeuristic, new()
    {
        protected T Heuristic;
        protected IList<ISelectorHeuristic> Heuristics;
        protected IList<ISelectorHeuristic> EmptyHeuristics;

        [SetUp]
        public void SetUp()
        {
            Heuristics = new List<ISelectorHeuristic>
                              {
                                  new AttributeHeuristic(),
                                  new ConstructorHeuristic(),
                                  new ContractHeuristic(),
                                  new EnablerHeuristic(),
                                  new OperationsHeuristic(),
                                  new PropertyHeuristic(),
                                  new ValidatorHeuristic()
                              };

            Heuristic = (from h in Heuristics
                         where h.GetType() == typeof (T)
                         select (T)h).First();
            EmptyHeuristics = new List<ISelectorHeuristic>();
        }
    }
}
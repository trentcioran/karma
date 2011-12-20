using System;
using System.Collections.Generic;
using System.Linq;
using Karma.Core.Metadata.Heuristics;

namespace Karma.Core.Metadata.Extractors
{
    public abstract class ExtractorBase<T> : IExtractor
        where T : class
    {
        public ISelectorHeuristic Heuristic { get; private set; }

        public ExtractorBase(SelectorHeuristic<T> heuristic)
        {
            Heuristic = heuristic;
        }

        protected IEnumerable<TEle> FilterByPrecedence<TEle>(IEnumerable<TEle> elements, 
            IList<ISelectorHeuristic> heuristics)
        {
            if (Heuristic.IsExclusive && heuristics.Any())
            {
                return elements.Where(element =>
                    heuristics.All(
                        selectorHeuristic => 
                            !selectorHeuristic.HasPrecedence(Heuristic, element))
                    );
            }

            return elements;
        }

        public abstract void Extract(Type source, ClassMetadata target, 
            IList<ISelectorHeuristic> heuristics);
    }
}
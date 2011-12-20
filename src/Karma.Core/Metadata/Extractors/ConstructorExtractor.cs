using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Karma.Core.Metadata.Heuristics;

namespace Karma.Core.Metadata.Extractors
{
    public class ConstructorExtractor : ExtractorBase<ConstructorMetadata>
    {
        public ConstructorExtractor(SelectorHeuristic<ConstructorMetadata> heuristic)
            :base(heuristic)
        {
        }

        public override void Extract(Type source, ClassMetadata target, IList<ISelectorHeuristic> heuristics)
        {
            IEnumerable<ConstructorInfo> constructors = (from i in source.GetConstructors()
                                                         where Heuristic.IsSelectable(i)
                                                         select i);

            constructors = FilterByPrecedence(constructors, heuristics);
            foreach (ConstructorInfo constructor in constructors)
            {
                target.Constructors.Add(new ConstructorMetadata(constructor));
            }
        }
    }
}
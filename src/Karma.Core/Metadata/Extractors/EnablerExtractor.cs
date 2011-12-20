using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Karma.Core.Metadata.Heuristics;

namespace Karma.Core.Metadata.Extractors
{
    public class EnablerExtractor : ExtractorBase<EnablerMetadata>
    {
        public EnablerExtractor(SelectorHeuristic<EnablerMetadata> heuristic)
            : base(heuristic)
        {
        }

        public override void Extract(Type source, ClassMetadata target, IList<ISelectorHeuristic> heuristics)
        {
            IEnumerable<MethodInfo> enablers = (from prop in source.GetMethods(BindingFlags.Public | BindingFlags.Instance)
                                                where Heuristic.IsSelectable(prop)
                                                select prop);

            enablers = FilterByPrecedence(enablers, heuristics);
            foreach (MethodInfo methodInfo in enablers)
            {
                target.Enablers.Add(new EnablerMetadata(methodInfo));
            }
        }
    }
}
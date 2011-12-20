using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Karma.Core.Metadata.Heuristics;

namespace Karma.Core.Metadata.Extractors
{
    public class OperationExtractor : ExtractorBase<OperationMetadata>
    {
        public OperationExtractor(SelectorHeuristic<OperationMetadata> heuristic)
            : base(heuristic)
        {
        }

        public override void Extract(Type source, ClassMetadata target, IList<ISelectorHeuristic> heuristics)
        {
            IEnumerable<MethodInfo> operations = (from prop in source.GetMethods(
                                                      BindingFlags.Public | BindingFlags.Instance)
                                                  where Heuristic.IsSelectable(prop)
                                                  select prop);

            operations = FilterByPrecedence(operations, heuristics);
            foreach (MethodInfo methodInfo in operations)
            {
                target.Operations.Add(new OperationMetadata(methodInfo));
            }
        }
    }
}
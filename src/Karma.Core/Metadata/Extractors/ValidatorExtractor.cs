using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Karma.Core.Metadata.Heuristics;

namespace Karma.Core.Metadata.Extractors
{
    public class ValidatorExtractor : ExtractorBase<ValidatorMetadata>
    {
        public ValidatorExtractor(SelectorHeuristic<ValidatorMetadata> heuristic)
            : base(heuristic)
        {
        }

        public override void Extract(Type source, ClassMetadata target, IList<ISelectorHeuristic> heuristics)
        {
            IEnumerable<MethodInfo> validators = (from prop in source.GetMethods(BindingFlags.Public | BindingFlags.Instance)
                                                  where Heuristic.IsSelectable(prop)
                                                  select prop);

            validators = FilterByPrecedence(validators, heuristics);
            foreach (MethodInfo methodInfo in validators)
            {
                target.Validators.Add(new ValidatorMetadata(methodInfo));
            }
        }
    }
}
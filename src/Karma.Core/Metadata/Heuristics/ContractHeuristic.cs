
using System;
using Karma.Core.Util;

namespace Karma.Core.Metadata.Heuristics
{
    public class ContractHeuristic :
        SelectorHeuristic<ContractMetadata>
    {
        public override bool IsExclusive
        {
            get { return true; }
        }

        public override bool IsSelectable(object memberInfo)
        {
            Type type = memberInfo as Type;
            Ensure.NotNull(type);

            return !type.Namespace.StartsWith("System");
        }
    }
}

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
            if (type == null)
            {
                return false;
            }

            return !type.Namespace.StartsWith("System");
        }
    }
}
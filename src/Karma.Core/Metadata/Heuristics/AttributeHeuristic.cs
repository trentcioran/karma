
using System;

namespace Karma.Core.Metadata.Heuristics
{
    public class AttributeHeuristic :
        SelectorHeuristic<AttributeMetadata>
    {
        public override bool IsExclusive
        {
            get { return false; }
        }

        public override bool IsSelectable(object memberInfo)
        {
            Attribute att = memberInfo as Attribute;

            return att != null;
        }
    }
}
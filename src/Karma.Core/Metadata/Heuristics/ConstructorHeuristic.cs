using System.Reflection;

namespace Karma.Core.Metadata.Heuristics
{
    public class ConstructorHeuristic :
        SelectorHeuristic<ConstructorMetadata>
    {
        public override bool IsExclusive
        {
            get { return true; }
        }

        public override bool IsSelectable(object memberInfo)
        {
            return (memberInfo as ConstructorInfo) != null;
        }
    }
}
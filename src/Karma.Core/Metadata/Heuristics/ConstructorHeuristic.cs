using System.Reflection;
using Karma.Core.Util;

namespace Karma.Core.Metadata.Heuristics
{
    public class ConstructorHeuristic :
        SelectorHeuristic<ConstructorMetadata>
    {
        public override bool IsSelectable(object memberInfo)
        {
            return true;
        }
    }
}
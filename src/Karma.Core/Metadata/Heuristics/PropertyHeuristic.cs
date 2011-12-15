using System.Reflection;
using Karma.Core.Util;

namespace Karma.Core.Metadata.Heuristics
{
    public class PropertyHeuristic :
        SelectorHeuristic<PropertyMetadata>
    {
        public override bool IsSelectable(object memberInfo)
        {
            return true;
        }
    }
}
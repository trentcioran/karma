
namespace Karma.Core.Metadata.Heuristics
{
    public class AttributeHeuristic :
        SelectorHeuristic<AttributeMetadata>
    {
        public override bool IsSelectable(object memberInfo)
        {
            return true;
        }
    }
}
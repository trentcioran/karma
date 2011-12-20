namespace Karma.Core.Metadata.Heuristics
{
    public class PropertyHeuristic :
        SelectorHeuristic<PropertyMetadata>
    {
        public override bool IsExclusive
        {
            get { return false; }
        }

        public override bool IsSelectable(object memberInfo)
        {
            return true;
        }
    }
}
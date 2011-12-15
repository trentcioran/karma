using System.Reflection;
using System.Text.RegularExpressions;
using Karma.Core.Util;

namespace Karma.Core.Metadata.Heuristics
{
    public class EnablerHeuristic :
        SelectorHeuristic<EnablerMetadata>
    {
        private readonly Regex _enablerExpression = new Regex(@"^Can[\w]+");

        public override bool IsSelectable(object memberInfo)
        {
            MethodInfo info = memberInfo as MethodInfo;
            Ensure.NotNull(info);

            return _enablerExpression.IsMatch(info.Name);
        }
    }
}
using System.Reflection;
using System.Text.RegularExpressions;
using Karma.Core.Util;

namespace Karma.Core.Metadata.Heuristics
{
    public class ValidatorHeuristic :
        SelectorHeuristic<ValidatorMetadata>
    {
        private readonly Regex _validatorExpression = new Regex(@"[\w]+IsValid$");

        public override bool IsExclusive
        {
            get { return true; }
        }

        public override bool IsSelectable(object memberInfo)
        {
            MethodInfo info = memberInfo as MethodInfo;
            Ensure.NotNull(info);

            return _validatorExpression.IsMatch(info.Name);
        }
    }
}
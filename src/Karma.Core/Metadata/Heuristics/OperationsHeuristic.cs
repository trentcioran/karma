using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using Karma.Core.Util;

namespace Karma.Core.Metadata.Heuristics
{
    public class OperationsHeuristic : 
        SelectorHeuristic<OperationMetadata>
    {
        private readonly Regex _blacklistExpression =
            new Regex(@"get_|set_|ToString|GetType|GetHashCode|Equals");

        private static IDictionary<string,ICollection<string>> methodsToIgnoreByTypeCache =
            new ConcurrentDictionary<string, ICollection<string>>();

        public override bool IsExclusive
        {
            get { return true; }
        }

        public override bool HasPrecedence(ISelectorHeuristic heuristic,
            object member)
        {
            SelectorHeuristic<OperationMetadata> typedHeuristic =
               heuristic as SelectorHeuristic<OperationMetadata>;
            if (typedHeuristic != null && heuristic != this)
            {
                //give preference to the passed heuristic
                return !heuristic.HasPrecedence(this, member);
            }

            return false;
        }

        public override bool IsSelectable(object memberInfo)
        {
            MethodInfo info = memberInfo as MethodInfo;
            Ensure.NotNull(info);

            ICollection<string> methodsToIgnore = GetMethodsToIgnore(info.DeclaringType);

            if (methodsToIgnore.Any())
            {
                return !_blacklistExpression.IsMatch(info.Name)
                    && !methodsToIgnore.Any(x => x.Equals(info.Name));
            }

            return !_blacklistExpression.IsMatch(info.Name);
        }

        private ICollection<string> GetMethodsToIgnore(Type type)
        {
            string key = type.FullName;

            if (!methodsToIgnoreByTypeCache.ContainsKey(key))
            {
                IList<string> ignoredMethods = (from i in type.GetInterfaces()
                                                where i.Namespace.StartsWith("System")
                                                let meths = i.GetMethods()
                                                from met in meths
                                                select met.Name).ToList();
                methodsToIgnoreByTypeCache.Add(key, ignoredMethods);
            }

            return methodsToIgnoreByTypeCache[key];
        }
    }
}

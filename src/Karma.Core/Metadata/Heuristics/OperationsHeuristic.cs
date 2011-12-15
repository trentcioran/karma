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

        private static IDictionary<string,ICollection<string>> methodsToIgnoreByType =
            new ConcurrentDictionary<string, ICollection<string>>();

        public override bool IsSelectable(object memberInfo)
        {
            MethodInfo info = memberInfo as MethodInfo;
            Ensure.NotNull(info);

            ICollection<string> methodsToIgnore = GetMethodsToIgnore(info.DeclaringType);

            return !_blacklistExpression.IsMatch(info.Name)
                && !methodsToIgnore.Any(x => x.Equals(info.Name));
        }

        private ICollection<string> GetMethodsToIgnore(Type type)
        {
            string key = type.FullName;

            if (!methodsToIgnoreByType.ContainsKey(key))
            {
                IList<string> ignoredMethods = (from i in type.GetInterfaces()
                                                where i.Namespace.StartsWith("System")
                                                let meths = i.GetMethods()
                                                from met in meths
                                                select met.Name).ToList();
                methodsToIgnoreByType.Add(key, ignoredMethods);
            }

            return methodsToIgnoreByType[key];
        }
    }
}

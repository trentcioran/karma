using System;

namespace Karma.Core.Metadata.Heuristics
{
    public abstract class SelectorHeuristic<T> : ISelectorHeuristic
        where T : class
    {
        public Type Target { get { return typeof(T); } }

        public abstract bool IsSelectable(object memberInfo);
    }
}
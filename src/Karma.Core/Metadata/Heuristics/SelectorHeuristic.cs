using System;

namespace Karma.Core.Metadata.Heuristics
{
    public abstract class SelectorHeuristic<T> : ISelectorHeuristic
        where T : class
    {
        public Type Target { get { return typeof(T); } }
        
        public abstract bool IsExclusive { get; }

        public virtual bool HasPrecedence(ISelectorHeuristic heuristic,
            object member)
        {
            if (IsExclusive && this != heuristic && IsSelectable(member))
            {
                return true;
            }

            return false;
        }

        public abstract bool IsSelectable(object memberInfo);
    }
}
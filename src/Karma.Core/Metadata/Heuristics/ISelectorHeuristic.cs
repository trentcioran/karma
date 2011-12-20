using System;

namespace Karma.Core.Metadata.Heuristics
{
    public interface ISelectorHeuristic
    {
        Type Target { get; }

        bool IsExclusive { get; }

        bool HasPrecedence(ISelectorHeuristic heuristic, object member);

        bool IsSelectable(object memberInfo);
    }
}
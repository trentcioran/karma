using System;

namespace Karma.Core.Metadata.Heuristics
{
    public interface ISelectorHeuristic
    {
        Type Target { get; }

        bool IsSelectable(object memberInfo);
    }
}
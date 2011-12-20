using System;
using System.Collections.Generic;
using Karma.Core.Metadata.Heuristics;

namespace Karma.Core.Metadata.Extractors
{
    public interface IExtractor
    {
        ISelectorHeuristic Heuristic { get; }

        void Extract(Type source, ClassMetadata target, IList<ISelectorHeuristic> heuristics);
    }
}
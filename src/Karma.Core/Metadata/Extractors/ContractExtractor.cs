using System;
using Karma.Core.Metadata.Heuristics;

namespace Karma.Core.Metadata.Extractors
{
    public class ContractExtractor : IExtractor
    {
        private SelectorHeuristic<ContractMetadata> _heuristic;

        public ContractExtractor(SelectorHeuristic<ContractMetadata> heuristic)
        {
            _heuristic = heuristic;
        }

        public void Extract(Type source, ClassMetadata target)
        {
            
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using Karma.Core.Metadata.Heuristics;

namespace Karma.Core.Metadata.Extractors
{
    public class ContractExtractor : ExtractorBase<ContractMetadata>
    {
        public ContractExtractor(SelectorHeuristic<ContractMetadata> heuristic)
            : base(heuristic)
        {
        }

        public override void Extract(Type source, ClassMetadata target, IList<ISelectorHeuristic> heuristics)
        {
            IEnumerable<Type> contracts = (from i in source.GetInterfaces()
                                           where Heuristic.IsSelectable(i)
                                           select i);

            contracts = FilterByPrecedence(contracts, heuristics);
            foreach (Type contract in contracts)
            {
                target.Contracts.Add(new ContractMetadata(contract));
            }
        }
    }
}

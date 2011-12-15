using System;
using System.Collections.Generic;

namespace Karma.Core.Metadata
{
    public class ContractMetadata
    {
        public Type Type { get; private set; }

        public string Name { get; private set; }

        public IList<Attribute> Attributes { get; private set; }

        public IList<ContractMetadata> Contracts { get; private set; }

        public IList<OperationMetadata> Operations { get; private set; }

        public ContractMetadata(Type type)
        {
            Contracts = new List<ContractMetadata>();
            Attributes = new List<Attribute>();
            Operations = new List<OperationMetadata>();
            Type = type;
            Name = type.Name;
        }
    }
}
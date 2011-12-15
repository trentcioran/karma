using System;
using System.Collections.Generic;

namespace Karma.Core.Metadata
{
    public class ClassMetadata: ContractMetadata
    {
        public Type BaseType { get; private set; }

        public IList<PropertyMetadata> Properties { get; private set; }

        public IList<ConstructorMetadata> Constructors { get; private set; } 

        public IList<OperationMetadata> Validators { get; private set; }

        public IList<OperationMetadata> Enablers { get; private set; } 

        public ClassMetadata(Type type): base(type)
        {
            if (type.BaseType != null && !type.BaseType.Equals(typeof(object)))
            {
                BaseType = type.BaseType;
            }
            Properties = new List<PropertyMetadata>();
            Constructors = new List<ConstructorMetadata>();
            Validators = new List<OperationMetadata>();
            Enablers = new List<OperationMetadata>();
        }
    }
}
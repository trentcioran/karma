using System;
using System.Collections.Generic;
using System.Reflection;

namespace Karma.Core.Metadata
{
    public class ParameterMetadata : IMemberMetadata<ParameterInfo>
    {
        public Type Type { get; private set; }

        public string Name { get; private set; }

        public IList<Attribute> Attributes { get; private set; }

        public ParameterInfo Member { get; private set; }
        
        public ParameterMetadata(ParameterInfo member, Type type)
        {
            Member = member;
            Name = member.Name;
            Type = type;
            Attributes = new List<Attribute>();
        }
    }
}
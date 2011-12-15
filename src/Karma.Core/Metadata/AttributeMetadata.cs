using System;

namespace Karma.Core.Metadata
{
    public class AttributeMetadata
    {
        public Type Type { get; private set; }

        public string Name { get; private set; }

        public Attribute Instance { get; private set; }

        public AttributeMetadata(Attribute attribute)
        {
            Type = attribute.GetType();
            Name = Type.Name;
            Instance = attribute;
        }
    }
}
using System;
using System.Collections.Generic;

namespace Karma.Core.Metadata
{
    public class AssemblyMetadata
    {
        public string AssemblyName { get; private set; }

        public IList<Attribute> Attributes { get; private set; }

        public IList<ClassMetadata> Classes { get; private set; }

        public AssemblyMetadata()
        {
            Classes = new List<ClassMetadata>();
            Attributes = new List<Attribute>();
        }
    }
}
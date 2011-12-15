using System;
using System.Collections.Generic;

namespace Karma.Core.Metadata
{
    public interface IMemberMetadata<T>
    {
        Type Type { get; }

        string Name { get; }

        IList<Attribute> Attributes { get; }

        T Member { get; }
    }
}
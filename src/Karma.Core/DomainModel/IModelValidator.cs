using System.Collections.Generic;
using Karma.Core.Metadata;

namespace Karma.Core.DomainModel
{
    public interface IModelValidator
    {
        void Validate(IList<AssemblyMetadata> metadata);
    }
}
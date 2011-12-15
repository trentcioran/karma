using System.Collections.Generic;
using Karma.Core.Metadata;

namespace Karma.Core.DomainModel
{
    public interface IModelBuilder
    {
        Model Build(IList<AssemblyMetadata> metadata);
    }
}
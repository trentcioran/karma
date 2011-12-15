using System;

namespace Karma.Core.Metadata.Extractors
{
    public interface IExtractor
    {
        void Extract(Type source, ClassMetadata target);
    }
}
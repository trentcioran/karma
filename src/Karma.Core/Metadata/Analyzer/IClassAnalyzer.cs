using System;

namespace Karma.Core.Metadata.Analyzer
{
    public interface IClassAnalyzer
    {
        ClassMetadata Analyze(Type type);
    }
}
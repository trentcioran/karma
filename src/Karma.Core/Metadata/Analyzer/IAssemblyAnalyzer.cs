using System.Reflection;

namespace Karma.Core.Metadata.Analyzer
{
    public interface IAssemblyAnalyzer
    {
        AssemblyMetadata Analyze(Assembly assembly);
    }
}
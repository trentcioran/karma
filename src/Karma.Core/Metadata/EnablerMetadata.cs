using System.Reflection;

namespace Karma.Core.Metadata
{
    public class EnablerMetadata : OperationMetadata
    {
        public EnablerMetadata(MethodInfo methodInfo)
            : base(methodInfo)
        {
        }
    }
}
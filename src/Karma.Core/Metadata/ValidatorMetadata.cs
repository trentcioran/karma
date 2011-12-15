using System.Reflection;

namespace Karma.Core.Metadata
{
    public class ValidatorMetadata : OperationMetadata
    {
        public ValidatorMetadata(MethodInfo methodInfo)
            : base(methodInfo)
        {
        }
    }
}
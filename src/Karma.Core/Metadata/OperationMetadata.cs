using System.Collections.Generic;
using System.Reflection;

namespace Karma.Core.Metadata
{
    public class OperationMetadata : MemberMetadata<MethodInfo>
    {
        public IList<ParameterMetadata> Parameters { get; private set; }

        public OperationMetadata(MethodInfo methodInfo)
            : base(methodInfo, methodInfo.ReturnType)
        {
            Parameters = new List<ParameterMetadata>();
        }
    }
}
using System.Collections.Generic;
using System.Reflection;

namespace Karma.Core.Metadata
{
    public class ConstructorMetadata : MemberMetadata<ConstructorInfo>
    {
        public IList<ParameterMetadata> Parameters { get; private set; }

        public ConstructorMetadata(ConstructorInfo constructorInfo)
            : base(constructorInfo, constructorInfo.DeclaringType)
        {
        }
    }
}
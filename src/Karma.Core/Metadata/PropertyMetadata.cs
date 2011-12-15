using System.Reflection;

namespace Karma.Core.Metadata
{
    public class PropertyMetadata: MemberMetadata<PropertyInfo>
    {
        public bool IsReadOnly { get; private set; }

        public PropertyMetadata(PropertyInfo property)
            : base(property, property.PropertyType)
        {
            IsReadOnly = !property.CanWrite;
        }
    }
}
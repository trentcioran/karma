using System;

namespace Karma.Core.Extension
{
    [AttributeUsage(AttributeTargets.Assembly |
        AttributeTargets.Class |
        AttributeTargets.Interface |
        AttributeTargets.Enum |
        AttributeTargets.Struct |
        AttributeTargets.Method |
        AttributeTargets.Property)]
    public class Attribute: System.Attribute
    {
    }
}

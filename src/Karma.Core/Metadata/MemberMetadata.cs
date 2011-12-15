using System;
using System.Collections.Generic;
using System.Reflection;

namespace Karma.Core.Metadata
{
    public abstract class MemberMetadata<T>: 
        IMemberMetadata<T> where T : MemberInfo
    {

        public Type Type { get; private set; }

        public string Name { get; private set; }

        public IList<Attribute> Attributes { get; private set; }

        public T Member { get; private set; }
        
        public MemberMetadata(T member, Type type)
        {
            Member = member;
            Name = member.Name;
            Type = type;
            Attributes = new List<Attribute>();
        }
    }
}

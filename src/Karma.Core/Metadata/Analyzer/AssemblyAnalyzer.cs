using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Karma.Core.Metadata.Analyzer
{
    public class AssemblyAnalyzer : IAssemblyAnalyzer
    {
        public IClassAnalyzer ClassAnalyzer { get; set; }

        public AssemblyMetadata Analyze(Assembly assembly)
        {
            AssemblyMetadata metadata = new AssemblyMetadata();
            Type[] types = SelectableTypes(assembly.GetTypes());
            foreach (Type type in types)
            {
                metadata.Classes.Add(ClassAnalyzer.Analyze(type));
            }

            IEnumerable<Attribute> attributes = (from a in assembly.GetCustomAttributes(true)
                                                 where typeof(Extension.Attribute).IsAssignableFrom(a.GetType())
                                                 select (Attribute)a);
            foreach (Attribute attribute in attributes)
            {
                metadata.Attributes.Add(attribute);
            }

            return metadata;
        }

        private Type[] SelectableTypes(Type[] assemblyTypes)
        {
            return (from t in assemblyTypes
                        where !typeof(Attribute).IsAssignableFrom(t)
                            && t.IsClass
                        select t)
                        .ToArray();
        }
    }
}

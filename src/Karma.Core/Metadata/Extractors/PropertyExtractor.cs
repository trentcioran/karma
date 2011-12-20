using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Karma.Core.Metadata.Heuristics;

namespace Karma.Core.Metadata.Extractors
{
    public class PropertyExtractor : ExtractorBase<PropertyMetadata>
    {
        public PropertyExtractor(SelectorHeuristic<PropertyMetadata> heuristic)
            : base(heuristic)
        {
        }

        public override void Extract(Type source, ClassMetadata target, IList<ISelectorHeuristic> heuristics)
        {
            IEnumerable<PropertyInfo> properties = (from prop in source.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                                                    where Heuristic.IsSelectable(prop)
                                                    select prop);

            properties = FilterByPrecedence(properties, heuristics);
            foreach (PropertyInfo propertyInfo in properties)
            {
                target.Properties.Add(new PropertyMetadata(propertyInfo));
            }
        }
    }
}
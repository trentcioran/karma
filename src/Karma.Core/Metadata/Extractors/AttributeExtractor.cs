using System;
using System.Collections.Generic;
using System.Linq;
using Karma.Core.Metadata.Heuristics;

namespace Karma.Core.Metadata.Extractors
{
    public class AttributeExtractor : ExtractorBase<AttributeMetadata>
    {
        public AttributeExtractor(SelectorHeuristic<AttributeMetadata> heuristic)
            : base(heuristic)
        {
        }

        public override void Extract(Type source, ClassMetadata target, IList<ISelectorHeuristic> heuristics)
        {
            IEnumerable<Attribute> attributes = (from a in source.GetCustomAttributes(true)
                                                 where Heuristic.IsSelectable(a)
                                                 select (Attribute)a);

            attributes = FilterByPrecedence(attributes, heuristics);
            foreach (Attribute attribute in attributes)
            {
                target.Attributes.Add(attribute);
            }
        }
    }
}
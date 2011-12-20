using System;
using System.Collections.Generic;
using System.Linq;
using Karma.Core.Metadata.Extractors;
using Karma.Core.Metadata.Heuristics;
using Karma.Core.Util;

namespace Karma.Core.Metadata.Analyzer
{
	public class ClassAnalyzer : IClassAnalyzer
	{
        private IList<IExtractor> _extractors;

        private IList<ISelectorHeuristic> _heuristics;

        public ClassAnalyzer(IList<IExtractor> extractors)
        {
            Ensure.NotNullOrEmpty(extractors);

            _extractors = extractors;
            _heuristics = _extractors.Select(x => x.Heuristic).ToList();
        }

		public ClassMetadata Analyze(Type type)
		{
			ClassMetadata metadata = new ClassMetadata(type);

		    foreach (IExtractor extractor in _extractors)
		    {
		        extractor.Extract(type, metadata, _heuristics);
		    }

		    return metadata;
		}
	}
}
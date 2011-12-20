using System;

namespace Karma.Core.ClassAnalyzerSample
{
    [Serializable]
    public class WithNoSelectableAttribute
    {
        public int Id { get; set; }

        public string PropertyA { get; set; }

        public string PropertyB { get; set; }
    }
}
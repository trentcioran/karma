using System;

namespace Karma.Core.ClassAnalyzerSample
{
    public class WithValidator
    {
        public int Id { get; set; }

        public string PropertyA { get; set; }

        public string PropertyB { get; set; }

        public bool SomethingIsValid(object val)
        {
            throw new NotImplementedException();
        }
    }
}
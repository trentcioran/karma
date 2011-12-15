using System;

namespace Karma.Core.ClassAnalyzerSample
{
    public class WithOperation
    {
        public int Id { get; set; }

        public string PropertyA { get; set; }

        public string PropertyB { get; set; }

        public void DoSomething(object val)
        {
            throw new NotImplementedException();
        }
    }
}
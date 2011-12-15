using System;

namespace Karma.Core.ClassAnalyzerSample
{
    public class ImplementsClonable : ICloneable
    {
        public object Clone()
        {
            throw new NotImplementedException();
        }
    }
}
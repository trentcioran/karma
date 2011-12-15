using System;

namespace Karma.Core.ClassAnalyzerSample
{
    public class ImplementsEquatable : IEquatable<int>
    {
        public bool Equals(int other)
        {
            throw new NotImplementedException();
        }
    }
}
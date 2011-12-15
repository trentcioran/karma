using System;

namespace Karma.Core.ClassAnalyzerSample
{
    public class ImplementsDisposable: IDisposable
    {
        public void Dispose()
        {
            throw new NotImplementedException();
        }
    }
}
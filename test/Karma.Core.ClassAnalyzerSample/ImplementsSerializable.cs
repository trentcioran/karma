using System;
using System.Runtime.Serialization;

namespace Karma.Core.ClassAnalyzerSample
{
    public class ImplementsSerializable : ISerializable
    {
        public void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            throw new NotImplementedException();
        }
    }
}
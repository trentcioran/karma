using System;
using System.Collections.Generic;
using Karma.Core.Metadata.Extractors;

namespace Karma.Core.Util
{
    public class Ensure
    {
        public static void NotNull(object val)
        {
            if (val == null)
            {
                throw new ArgumentNullException();
            }
        }

        public static void NotEmpty(ICollection<IExtractor> collection)
        {
            if (collection.Count == 0)
            {
                throw new ArgumentNullException();
            }
        }

        public static void NotNullOrEmpty(ICollection<IExtractor> collection)
        {
            NotNull(collection);
            if (collection.Count == 0)
            {
                throw new ArgumentException();
            }
        }
    }
}

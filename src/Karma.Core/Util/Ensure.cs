using System;

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
    }
}

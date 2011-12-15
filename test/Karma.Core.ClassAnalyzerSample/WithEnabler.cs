namespace Karma.Core.ClassAnalyzerSample
{
    public class WithEnabler
    {
        public int Id { get; set; }

        public string PropertyA { get; set; }

        public string PropertyB { get; set; }

        public bool CanDoSomething()
        {
            return false;
        }
    }
}
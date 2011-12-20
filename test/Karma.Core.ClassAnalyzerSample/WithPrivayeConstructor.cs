namespace Karma.Core.ClassAnalyzerSample
{
    public class WithPrivayeConstructor
    {
        private WithPrivayeConstructor()
        {
        }

        public int Id { get; set; }

        public string PropertyA { get; set; }

        public string PropertyB { get; set; }
    }
}
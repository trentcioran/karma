namespace Karma.Core.ClassAnalyzerSample
{
    public class WithConstructor
    {
        public IDependencyContract Validator;

        public WithConstructor(IDependencyContract validator)
        {
            Validator = validator;
        }

        public int Id { get; set; }

        public string PropertyA { get; set; }

        public string PropertyB { get; set; }
    }
}

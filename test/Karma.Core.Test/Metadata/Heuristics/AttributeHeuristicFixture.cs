using System;
using Karma.Core.ClassAnalyzerSample;
using Karma.Core.Metadata.Heuristics;
using NUnit.Framework;

namespace Karma.Core.Test.Metadata.Heuristics
{
    [TestFixture]
    public class AttributeHeuristicFixture
    {
        [Test]
        public void WithNoSelectableAttributesTest()
        {
            AttributeHeuristic heuristic = new AttributeHeuristic();

            Type type = typeof(WithAttribute);
            var items = type.GetConstructors();

            bool selectable = heuristic.IsSelectable(items[0]);
            Assert.That(selectable, Is.False);
        }

        [Test]
        public void WithAttributesTest()
        {
            AttributeHeuristic heuristic = new AttributeHeuristic();

            Type type = typeof(WithAttribute);
            object[] attributes = type.GetCustomAttributes(false);

            bool selectable = heuristic.IsSelectable(attributes[0]);
            Assert.That(selectable, Is.True);
        }
    }
}

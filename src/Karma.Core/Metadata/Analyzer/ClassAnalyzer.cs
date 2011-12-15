using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using Karma.Core.Metadata.Heuristics;

namespace Karma.Core.Metadata.Analyzer
{
	public class ClassAnalyzer : IClassAnalyzer
	{
        private readonly Regex _validatorExpression = new Regex(@"[\w]+IsValid$");
        private readonly Regex _enablerExpression = new Regex(@"^Can[\w]+");
        private readonly Regex _blacklistExpression = new Regex(@"get_|set_|ToString|GetType|GetHashCode|Equals");

	    private IEnumerable<ISelectorHeuristic> _heuristics;

        public ClassAnalyzer(IEnumerable<ISelectorHeuristic> heuristics)
        {
            _heuristics = heuristics;
        }

		public ClassMetadata Analyze(Type type)
		{
			ClassMetadata metadata = new ClassMetadata(type);

            // contracts
		    IEnumerable<Type> ignoredContracts = (from i in type.GetInterfaces()
		                                          where i.Namespace.StartsWith("System")
		                                          select i).ToList();

		    IEnumerable<Type> contracts = (from i in type.GetInterfaces()
                                           where !i.Namespace.StartsWith("System")
		                                   select i);
		    foreach (Type contract in contracts)
		    {
		        metadata.Contracts.Add(new ContractMetadata(contract));
		    }

            // constructos
            ConstructorInfo[] constructors = type.GetConstructors();
            foreach (ConstructorInfo constructor in constructors)
            {
                metadata.Constructors.Add(new ConstructorMetadata(constructor));
            }

            // attributes
            IEnumerable<Attribute> attributes = (from a in type.GetCustomAttributes(true)
                                                 where typeof(Extension.Attribute).IsAssignableFrom(a.GetType())
                                                 select (Attribute)a);
            foreach (Attribute attribute in attributes)
            {
                metadata.Attributes.Add(attribute);
            }

            // properties 
            IEnumerable<PropertyInfo> properties = metadata.Type.GetProperties(BindingFlags.Public | 
                BindingFlags.Instance);
            foreach (PropertyInfo propertyInfo in properties)
            {
                metadata.Properties.Add(new PropertyMetadata(propertyInfo));
            }

            // operations
		    IEnumerable<MethodInfo> operations = GetMethods(type, ignoredContracts,
                m => !(_validatorExpression.IsMatch(m.Name) || _enablerExpression.IsMatch(m.Name)));
            foreach (MethodInfo methodInfo in operations)
            {
                metadata.Operations.Add(new OperationMetadata(methodInfo));
            }

            // validators
            IEnumerable<MethodInfo> validators = GetMethods(type, ignoredContracts, 
                m => _validatorExpression.IsMatch(m.Name));
            foreach (MethodInfo methodInfo in validators)
            {
                metadata.Validators.Add(new OperationMetadata(methodInfo));
            }
            
            // enablers
            IEnumerable<MethodInfo> enablers = GetMethods(type, ignoredContracts, 
                m => _enablerExpression.IsMatch(m.Name));
            foreach (MethodInfo methodInfo in enablers)
            {
                metadata.Enablers.Add(new OperationMetadata(methodInfo));
            }

			return metadata;
		}

        private IEnumerable<MethodInfo> GetMethods(Type type, IEnumerable<Type> ignoredContracts, 
            Func<MethodInfo, bool> expression)
	    {
            if (ignoredContracts.Any())
            {
                return (from m in type.GetMethods(BindingFlags.Public | BindingFlags.Instance)
                        from ic in ignoredContracts
                        let ims = ic.GetMethods()
                        from im in ims
                        where expression(m) && !_blacklistExpression.IsMatch(m.Name)
                            && m.Name != im.Name
                        select m);
            }
            return (from m in type.GetMethods(BindingFlags.Public | BindingFlags.Instance)
	                where  expression(m) && !_blacklistExpression.IsMatch(m.Name)
	                select m);
	    }
	}
}
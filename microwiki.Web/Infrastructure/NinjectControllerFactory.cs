using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Ninject;
using Ninject.Modules;
using microwiki.Domain.Abstract;
using microwiki.Domain.Concrete;

namespace microwiki.Web.Infrastructure {
    public class NinjectControllerFactory : DefaultControllerFactory
    {
        // The kernel is the thing that can supply object instances
        private IKernel kernel = new StandardKernel(new NinjectConfiguration());

        protected override IController GetControllerInstance(System.Web.Routing.RequestContext requestContext, Type controllerType)
        {
            if (controllerType == null) return null;

            return (IController)kernel.Get(controllerType);
        }

        private class NinjectConfiguration : NinjectModule
        {
            public override void Load()
            {
                Bind<IUnitOfWork>()
                    .To<UnitOfWork>()
                    .InRequestScope()
                    .WithConstructorArgument("databaseFactory", new DbFactory());

                Bind<IDocumentRepository>()
                    .To<DocumentRepository>()
                    .InRequestScope();
            }
        }
    }
}
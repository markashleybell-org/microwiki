using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace microwiki.Helpers
{
    public class BasicAuthenticationUnauthorizedResult : HttpUnauthorizedResult
    {
        private string _realm;

        public BasicAuthenticationUnauthorizedResult() : base() 
        { 
            _realm = ConfigurationManager.AppSettings["PublisherName"];
        }
        
        public BasicAuthenticationUnauthorizedResult(string statusDescription) : base(statusDescription) 
        { 
            _realm = ConfigurationManager.AppSettings["PublisherName"];
        }
 
        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null) 
                throw new ArgumentNullException("context");

            context.HttpContext.Response.AddHeader("WWW-Authenticate", string.Format("Basic realm=\"{0}\"", _realm));

            base.ExecuteResult(context);
        }
    }
}
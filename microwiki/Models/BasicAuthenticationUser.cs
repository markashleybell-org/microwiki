using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace microwiki.Models
{
    public class BasicAuthenticationUser : IPrincipal
    {
        private IIdentity _identity;

        public BasicAuthenticationUser(IIdentity identity)
        {
            _identity = identity;
        }

        public IIdentity Identity
        {
            get { return _identity; }
        }

        public bool IsInRole(string role)
        {
            throw new NotImplementedException();
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;

namespace microwiki.Models
{
    public class BasicAuthenticationIdentity : IIdentity
    {
        private string _name;

        public BasicAuthenticationIdentity(string name)
        {
            _name = name;
        }

        public string AuthenticationType
        {
            get { return "Basic"; }
        }

        public bool IsAuthenticated
        {
            get { return true; }
        }

        public string Name
        {
            get { return _name; }
        }
    }
}
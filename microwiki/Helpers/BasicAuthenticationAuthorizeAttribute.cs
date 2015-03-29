using microwiki.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace microwiki.Helpers
{
    public class BasicAuthenticationAuthorizeAttribute : AuthorizeAttribute
    {
        private Dictionary<string, string> _credentials;

        private bool _requireSecureConnection;

        public BasicAuthenticationAuthorizeAttribute()
        {
            // Load the list of users from Web.config
            var credentialData = ConfigurationManager.AppSettings["Credentials"];

            // Credential pairs are delimited with pipe, username/password by ^
            _credentials = credentialData.Split('|')
                                         .Select(c => c.Split('^'))
                                         .Select(c => new[] { c[0], c[1] })
                                         .ToDictionary(c => c[0], c => c[1]);

            _requireSecureConnection = Convert.ToBoolean(ConfigurationManager.AppSettings["RequireSecureConnection"]);
        }

        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            if (httpContext == null) 
                throw new ArgumentNullException("httpContext");

            if (_requireSecureConnection && !httpContext.Request.IsSecureConnection) 
                return false;
 
            if (!httpContext.Request.Headers.AllKeys.Contains("Authorization")) 
                return false;
 
            var authHeader = httpContext.Request.Headers["Authorization"];
            
            if (!string.IsNullOrWhiteSpace(authHeader))
            {
                var credential = ASCIIEncoding.ASCII.GetString(Convert.FromBase64String(authHeader.Substring(6))).Split(':');

                var user = new { Name = credential[0].Trim(), Password = credential[1].Trim() };

                // If neither username or password are empty
                if (!string.IsNullOrWhiteSpace(user.Name)
                 && !string.IsNullOrWhiteSpace(user.Password)
                 && _credentials.ContainsKey(user.Name) // And the username exists
                 && _credentials[user.Name] == user.Password) // And the password matches the password
                {
                    httpContext.User = new BasicAuthenticationUser(new BasicAuthenticationIdentity(user.Name));
                    Thread.CurrentPrincipal = httpContext.User;

                    return true;
                }
            }

            return false;
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            filterContext.Result = new BasicAuthenticationUnauthorizedResult();
        }

        public bool RequireSecureConnection
        {
            get { return _requireSecureConnection; }
            set { _requireSecureConnection = value; }
        }
    }
}
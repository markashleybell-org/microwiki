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
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = false)]
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

        private bool IsSecureConnection(HttpRequestBase httpRequest)
        {
            var headers = httpRequest.Headers;

            // If we're behind a load balancer (in this case, AppHarbor's), Request.IsSecureConnection will be 
            // false even if the client-server connection is HTTPS. We need to inspect the protocol of the 
            // forwarded request (passed in a HTTP header) to find out if the client connection is secure
            if (headers.AllKeys.Contains("X-Forwarded-Proto"))
            {
                // Check if the client connection protocol was HTTPS
                if (string.Equals(headers["X-Forwarded-Proto"], Uri.UriSchemeHttps, StringComparison.InvariantCultureIgnoreCase))
                    return true;
            }
            else
            {
                // We're just dealing with a normal connection, so we can use Request.IsSecureConnection
                if (httpRequest.IsSecureConnection)
                    return true;
            }

            return false;
        }

        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            if (httpContext == null) 
                throw new ArgumentNullException("httpContext");

            var headers = httpContext.Request.Headers;

            // Does this instance of the app require a HTTPS connection? 
            // It definitely should, unless you are running the app on a non-public/internal server...
            // If the connection isn't HTTPS, fail authentication
            if (_requireSecureConnection && !IsSecureConnection(httpContext.Request))
                return false;

            // If there's no auth header, fail authentication
            if (!headers.AllKeys.Contains("Authorization")) 
                return false;

            var authHeader = headers["Authorization"];

            // If there *is* an auth header and it's not empty
            if (!string.IsNullOrWhiteSpace(authHeader))
            {
                // Parse the header value and get the username/password strings
                var credential = ASCIIEncoding.ASCII.GetString(Convert.FromBase64String(authHeader.Substring(6))).Split(':');
                var user = new { Name = credential[0].Trim(), Password = credential[1].Trim() };

                // If neither username or password are empty
                if (!string.IsNullOrWhiteSpace(user.Name)
                 && !string.IsNullOrWhiteSpace(user.Password)
                 && _credentials.ContainsKey(user.Name) // And the username exists
                 && _credentials[user.Name] == user.Password) // And the password matches the password
                {
                    // Set the context principal so we can use User.Identity in our controller and view code
                    httpContext.User = new BasicAuthenticationUser(new BasicAuthenticationIdentity(user.Name));
                    // Set the principal on the thread too, as it's possible for this to get out of sync with that of the context
                    Thread.CurrentPrincipal = httpContext.User;

                    return true;
                }
            }

            return false;
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            var request = filterContext.HttpContext.Request;

            // If we require a secure connection, redirect to the HTTPS version of the requested URL
            if (_requireSecureConnection && !IsSecureConnection(request))
            {
                var uri = new UriBuilder(request.Url);
                uri.Scheme = Uri.UriSchemeHttps;

                filterContext.Result = new RedirectResult(uri.ToString());
            }
            else
            {
                filterContext.Result = new BasicAuthenticationUnauthorizedResult();
            }
        }

        public bool RequireSecureConnection
        {
            get { return _requireSecureConnection; }
            set { _requireSecureConnection = value; }
        }
    }
}
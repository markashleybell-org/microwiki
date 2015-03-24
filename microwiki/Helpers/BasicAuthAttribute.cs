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
    public class BasicAuthAttribute : ActionFilterAttribute
    {
        private string _realm;
        private Dictionary<string, string> _credentials;

        public BasicAuthAttribute()
        {
            _realm = ConfigurationManager.AppSettings["PublisherName"];

            var credentialData = ConfigurationManager.AppSettings["Credentials"];

            // Credential pairs are delimited with pipe, username/password by ^
            _credentials = credentialData.Split('|')
                                         .Select(c => c.Split('^'))
                                         .Select(c => new[] { c[0], c[1] })
                                         .ToDictionary(c => c[0], c => c[1]);
        }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var request = filterContext.HttpContext.Request;
            var authHeader = request.Headers["Authorization"];

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
                    filterContext.HttpContext.User = new BasicAuthUser(new BasicAuthIdentity(user.Name));
                    Thread.CurrentPrincipal = filterContext.HttpContext.User;
                    return;
                }
            }

            var response = filterContext.HttpContext.Response;
            response.StatusCode = 401;
            response.AddHeader("WWW-Authenticate", string.Format("Basic realm=\"{0}\"", _realm));
            response.Write("<h1>Not Authorised</h1>");
            response.End();
        }
    }
}
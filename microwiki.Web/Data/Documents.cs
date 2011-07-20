using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Massive;
using System.Configuration;

namespace microwiki.Web.Data
{
    public class Documents : DynamicModel
    {
        public Documents() : base("microwiki")
        {
            PrimaryKeyField = "ID";
        }
    }
}
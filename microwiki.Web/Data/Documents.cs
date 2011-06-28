using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Massive;

namespace microwiki.Web.Data
{
    public class Documents : DynamicModel
    {
        public Documents() : base("Db") 
        {
            PrimaryKeyField = "DocumentID";
        }
    }
}
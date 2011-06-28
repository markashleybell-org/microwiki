using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using microwiki.Domain.Entities;
using microwiki.Domain.Concrete;

namespace microwiki.Web.Configuration 
{
    public static class SetupServices
    {
        public static void InitializeDb()
        {
            Database.SetInitializer<Db>(new DbInitializer());
            //Database.SetInitializer(null);
        }
    }

    public class DbInitializer : DropCreateDatabaseIfModelChanges<Db>
    {
        protected override void Seed(Db context)
        {
            var document = new Document {
                Title = "Home",
                Created = DateTime.Now,
                LastEdited = DateTime.Now,
                Body = "This is the home page"
            };

            context.Documents.Add(document);
        }
    }
}
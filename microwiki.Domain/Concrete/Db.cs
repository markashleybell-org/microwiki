using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Entity;
using microwiki.Domain.Entities;

namespace microwiki.Domain.Concrete 
{
    public class Db : DbContext
    {
        private IDbSet<Document> _documents;
        
        public IDbSet<Document> Documents
        {
            get { return _documents ?? (_documents = DbSet<Document>()); }
        }

        public virtual IDbSet<T> DbSet<T>() where T : class
        {
            return Set<T>();
        }

        public virtual void Commit()
        {
            base.SaveChanges();
        }

        // Customise properties of database columns when the database is initially created
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}

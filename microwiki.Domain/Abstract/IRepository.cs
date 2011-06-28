using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Linq.Expressions;

namespace microwiki.Domain.Abstract 
{
    public interface IRepository<T> where T : class
    {
        IQueryable<T> All();
        IQueryable<T> Query(Expression<Func<T, bool>> filter);
        T Get(long id);
        void Add(T entity);
        void Remove(long id);
    }
}

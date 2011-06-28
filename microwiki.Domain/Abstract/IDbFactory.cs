using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using microwiki.Domain.Concrete;

namespace microwiki.Domain.Abstract 
{
    public interface IDbFactory : IDisposable
    {
        Db Get();
    }
}

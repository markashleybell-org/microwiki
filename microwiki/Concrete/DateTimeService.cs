using System;
using MicroWiki.Abstract;

namespace MicroWiki.Concrete
{
    public class DateTimeService : IDateTimeService
    {
        public DateTime Now => DateTime.Now;
    }
}

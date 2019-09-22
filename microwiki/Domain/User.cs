using System;

namespace MicroWiki.Domain
{
    public class User
    {
        public User(
            Guid id,
            string email,
            string password)
        {
            ID = id;
            Email = email;
            Password = password;
        }

        public Guid ID { get; }

        public string Email { get; }

        public string Password { get; }
    }
}

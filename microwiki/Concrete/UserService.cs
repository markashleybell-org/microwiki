using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using MicroWiki.Abstract;
using MicroWiki.Domain;

namespace MicroWiki.Concrete
{
    public class UserService : IUserService
    {
        private readonly IRepository _repository;

        public UserService(IRepository repository) =>
            _repository = repository;

        public ClaimsPrincipal GetClaimsPrincipal(Guid id, string email)
        {
            var claims = new[] {
                new Claim(ClaimTypes.Sid, id.ToString()),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, "Member")
            };

            var identity = new ClaimsIdentity(
                claims: claims,
                authenticationType: CookieAuthenticationDefaults.AuthenticationScheme,
                nameType: ClaimTypes.Email,
                roleType: ClaimTypes.Role
            );

            return new ClaimsPrincipal(identity);
        }

        public async Task<(bool valid, Guid? id)> ValidateLogin(string email, string password)
        {
            var user = await _repository.FindUserByEmail(email);

            if (user == null)
            {
                return (false, default(Guid?));
            }

            var hasher = new PasswordHasher<User>();

            var result = hasher.VerifyHashedPassword(user, user.Password, password);

            if (result == PasswordVerificationResult.Failed)
            {
                return (false, default);
            }

            if (result == PasswordVerificationResult.SuccessRehashNeeded)
            {
                // Upgrade the password hash
                var newHash = hasher.HashPassword(user, password);

                await _repository.UpdatePasswordHash(user.ID, newHash);
            }

            return (true, user.ID);
        }
    }
}

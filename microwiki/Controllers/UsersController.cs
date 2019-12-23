using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MicroWiki.Abstract;
using MicroWiki.Models;
using MicroWiki.Support;
using static MicroWiki.Domain.Constants;

namespace MicroWiki.Controllers
{
    public class UsersController : ControllerBase
    {
        private readonly Settings _cfg;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IDateTimeService _dateTimeService;
        private readonly IUserService _userService;

        public UsersController(
            IOptionsMonitor<Settings> optionsMonitor,
            IHttpContextAccessor httpContextAccessor,
            IDateTimeService dateTimeService,
            IUserService userService)
        {
            _cfg = optionsMonitor.CurrentValue;
            _httpContextAccessor = httpContextAccessor;
            _dateTimeService = dateTimeService;
            _userService = userService;
        }

        [AllowAnonymous]
        public IActionResult Login(string returnUrl)
        {
            var model = new LoginViewModel {
                ReturnUrl = returnUrl
            };

            return View(model);
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var (valid, id) = await _userService.ValidateLogin(model.Email, model.Password);

            if (!valid)
            {
                return View(model);
            }

            var principal = _userService.GetClaimsPrincipal(id.Value, model.Email);

            var authenticationProperties = new AuthenticationProperties {
                IsPersistent = true,
                ExpiresUtc = _dateTimeService.Now.AddDays(_cfg.PersistentSessionLengthInDays)
            };

            await _httpContextAccessor.HttpContext.SignInAsync(principal, authenticationProperties);

            var returnUrl = !string.IsNullOrWhiteSpace(model.ReturnUrl) && Url.IsLocalUrl(model.ReturnUrl)
                ? model.ReturnUrl
                : SiteRootUrl;

            return Redirect(returnUrl);
        }

        public async Task<IActionResult> Logout()
        {
            await _httpContextAccessor.HttpContext.SignOutAsync();

            return Redirect(SiteRootUrl);
        }
    }
}

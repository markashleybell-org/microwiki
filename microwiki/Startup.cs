using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MicroWiki.Abstract;
using MicroWiki.Concrete;
using MicroWiki.Support;

namespace MicroWiki
{
    public class Startup
    {
        public Startup(IConfiguration configuration) =>
            Configuration = configuration;

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            var connectionString = Configuration.GetValue<string>("ConnectionString");
            var authenticationScheme = CookieAuthenticationDefaults.AuthenticationScheme;

            services.AddHttpContextAccessor();

            services.Configure<Settings>(Configuration);

            services.Configure<CookiePolicyOptions>(options => {
                options.CheckConsentNeeded = context => false;
                options.MinimumSameSitePolicy = SameSiteMode.Strict;
                options.HttpOnly = HttpOnlyPolicy.Always;
                options.Secure = CookieSecurePolicy.Always;
            });

            services.AddAuthentication(authenticationScheme)
                .AddCookie(authenticationScheme, options => {
                    options.LoginPath = "/users/login";
                    options.LogoutPath = "/users/logout";

                    // options.AccessDeniedPath = "????";
                });

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IDateTimeService, DateTimeService>();

            services.AddScoped<IRepository, SqlServerRepository>(sp => {
                var ctxAccessor = sp.GetRequiredService<IHttpContextAccessor>();
                var optionsMonitor = sp.GetRequiredService<IOptionsMonitor<Settings>>();
                var userName = ctxAccessor.HttpContext.User.Identity.Name;
                return new SqlServerRepository(optionsMonitor, userName);
            });

            services.AddScoped<IFileManager, LocalFileManager>();

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseDeveloperExceptionPage();

            if (!env.IsDevelopment())
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseCookiePolicy();

            app.UseAuthentication();

            app.UseMvc(routes => {
                routes.MapRoute(
                    name: "default",
                    template: "wiki/{action}/{id?}",
                    defaults: new { controller = "Wiki", action = "Index" }
                );

                routes.MapRoute(
                    name: "files",
                    template: "files/{action}/{id?}",
                    defaults: new { controller = "Files", action = "Index" }
                );

                routes.MapRoute(
                    name: "tags",
                    template: "tags/{action}/{id?}",
                    defaults: new { controller = "Tags", action = "Index" }
                );

                routes.MapRoute(
                    name: "users",
                    template: "users/{action}/{id?}",
                    defaults: new { controller = "Users", action = "Index" }
                );

                routes.MapRoute(
                    name: "read",
                    template: "{*location}",
                    defaults: new { controller = "Wiki", action = "Read" }
                );
            });
        }
    }
}

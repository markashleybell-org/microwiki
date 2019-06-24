using Microsoft.AspNetCore.Mvc;

namespace MicroWiki.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index() => View();
    }
}

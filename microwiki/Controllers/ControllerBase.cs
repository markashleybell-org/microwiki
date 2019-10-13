using Microsoft.AspNetCore.Mvc;

namespace MicroWiki.Controllers
{
    public class ControllerBase : Controller
    {
        public override PartialViewResult PartialView(string name, object model) =>
            base.PartialView($"_{name}", model);
    }
}

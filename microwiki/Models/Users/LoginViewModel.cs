using System.ComponentModel.DataAnnotations;

namespace MicroWiki.Models
{
    public class LoginViewModel : ViewModelBase
    {
        public LoginViewModel()
            : base("Log In")
        {
        }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        public string ReturnUrl { get; set; }
    }
}

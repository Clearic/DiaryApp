using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Backend.Models
{
    public class User : IdentityUser
    {
        public ICollection<Note> Notes { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Threading.Tasks;
using Backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace Backend.Pages.Backup
{
    public class RestoreModel : PageModel
    {
        private readonly INotesRepository repo;

        public RestoreModel(INotesRepository repo)
        {
            this.repo = repo;
        }

        [BindProperty]
        public IFormFile Upload { get; set; }

        public void OnGet()
        {

        }

        public IActionResult OnPost()
        {
            using (var stream = Upload.OpenReadStream())
            {
                var userId = Utils.GetUserId(HttpContext);
                var notes = BackupUtils.ReadNotesBackup(stream, userId);

                repo.DeleteAllNotes(userId);
                repo.CreateNotes(notes);

                return Redirect("/");
            }
        }
    }
}

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
        private readonly AppDbContext db;

        public RestoreModel(AppDbContext db)
        {
            this.db = db;
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

                db.Database.ExecuteSqlCommand("DELETE FROM \"Notes\" WHERE \"UserId\" = {0}", userId);
                db.Notes.AddRange(notes);
                db.SaveChanges();

                return Redirect("/");
            }
        }
    }
}

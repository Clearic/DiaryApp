﻿using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Backend.Pages.Backup
{
    [Authorize]
    [IgnoreAntiforgeryToken(Order = 1001)]
    public class DownloadModel : PageModel
    {
        private readonly AppDbContext db;

        public DownloadModel(AppDbContext db)
        {
            this.db = db;
        }

        public void OnGet()
        {

        }

        public IActionResult OnPost()
        {
            var userId = Utils.GetUserId(HttpContext);
            var notes = db.Notes.Where(x => x.UserId == userId).ToList();

            var stream = new MemoryStream();

            BackupUtils.WriteNotesBackup(stream, notes);

            stream.Position = 0;

            return File(stream, "application/zip", "notes.zip");
        }
    }
}
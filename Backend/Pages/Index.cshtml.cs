using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Backend.Pages
{
    [Authorize]
    public class SpaModel : PageModel
    {
        readonly INotesRepository notesRepo;

        public SpaModel(INotesRepository notesRepo)
        {
            this.notesRepo = notesRepo;
        }

        public object InitData { get; set; }

        public void OnGet()
        {
            var today = DateTime.Today;

            var notes = notesRepo.GetNotesByDate(
                GetUserId(),
                new DateTime(today.Year, today.Month, 1),
                new DateTime(today.Year, today.Month, DateTime.DaysInMonth(today.Year, today.Month)));

            InitData = new
            {
                month = new
                {
                    year = today.Year,
                    month = today.Month
                },
                notes = notes.Select(x => new NoteResultModel(x)).ToList()
            };
        }

        string GetUserId()
        {
            var nameIdentifierClaim = User.Claims
                .Where(x => x.Type == ClaimTypes.NameIdentifier)
                .FirstOrDefault();

            if (nameIdentifierClaim == null)
                throw new Exception("No NameIdentifier claim");

            return nameIdentifierClaim.Value;
        }
    }
}

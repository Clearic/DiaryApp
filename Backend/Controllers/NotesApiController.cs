using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Backend.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Backend.Controllers
{
    [Route("api/notes")]
    public class NotesApiController : Controller
    {
        readonly INotesRepository notesRepo;

        public NotesApiController(INotesRepository notesRepo)
        {
            this.notesRepo = notesRepo;
        }

        [HttpGet]
        public IActionResult GetNotes(string from, string to)
        {
            DateTime? fromDate = null;
            DateTime? toDate = null;

            if (from != null) 
            {
                if (DateFormatter.TryParseDate(from, out var date))
                    fromDate = date;
                else
                    ModelState.AddModelError(nameof(from), "Invalid Date");
            }

            if (to != null) 
            {
                if (DateFormatter.TryParseDate(to, out var date))
                    toDate = date;
                else
                    ModelState.AddModelError(nameof(to), "Invalid Date");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var notes = notesRepo.GetNotesByDate(Utils.GetUserId(HttpContext), fromDate, toDate)
                .OrderBy(x => x.Date)
                .Select(x => new NoteResultModel(x))
                .ToList();

            return Ok(notes);
        }

        [HttpGet("{id}", Name = "GetNote")]
        public IActionResult GetNote([FromQuery] string id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var note = notesRepo.GetById(id);
            if (note == null) 
                return NotFound($"Note {id} not found");

            if (note.UserId != Utils.GetUserId(HttpContext))
                return BadRequest("You are not authorized to see this note");

            return Ok(new NoteResultModel(note));
        }

        [HttpPost]
        public IActionResult CreateNote([FromBody] NoteCreateModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!DateFormatter.TryParseDateTime(model.Date, out var date)) {
                ModelState.AddModelError(nameof(model.Date), "Invalid Date");
                return BadRequest(ModelState);
            }

            var now = DateTime.Now;
            var note = new Note() 
            {
                Date = date,
                Text = model.Text,
                UserId = Utils.GetUserId(HttpContext),
                Created = now,
                Modified = now
            };
            notesRepo.CreateNote(note);

            return CreatedAtRoute("GetNote", new { id = note.Id }, new { id = note.Id });
        }

        [HttpPut("{id}")]
        public IActionResult UpdateNote([FromQuery] string id, [FromBody] NoteUpdateModel model)
        {
            if (!ModelState.IsValid) 
                return BadRequest(ModelState);

            var note = notesRepo.GetById(id);
            if (note == null) 
                return NotFound($"Note {id} not found");

            if (note.UserId != Utils.GetUserId(HttpContext))
                return BadRequest("You are not authorized to change this note");

            if (model.Date != null) {
                if (!DateFormatter.TryParseDateTime(model.Date, out var date)) {
                    ModelState.AddModelError(nameof(model.Date), "Invalid Date");
                    return BadRequest(ModelState);
                }
                note.Date = date;
            }

            note.Text = model.Text ?? note.Text;
            note.Modified = DateTime.Now;
            notesRepo.UpdateNote(note);
            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteNote([FromQuery] string id)
        {
            var note = notesRepo.GetById(id);
            if (note == null) 
                return NotFound($"Note {id} not found");

            if (note.UserId != Utils.GetUserId(HttpContext))
                return BadRequest("You are not authorized to delete this note");

            notesRepo.DeleteNote(note);

            return Ok();
        }
    }
}

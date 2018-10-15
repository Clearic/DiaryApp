using System;
using System.Collections.Generic;
using System.Linq;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    public class NotesRepository : INotesRepository
    {
        private readonly AppDbContext db;

        public NotesRepository(AppDbContext context)
        {
            this.db = context;
        }

        public Note GetById(string id)
        {
            return db.Notes.FirstOrDefault(x => x.Id == id);
        }

        public List<Note> GetAllNotes(string userId)
        {
            return db.Notes.Where(x => x.UserId == userId).ToList();
        }

        public List<Note> GetNotesByDate(string userId, DateTime? from, DateTime? to)
        {
            var query = db.Notes.Where(x => x.UserId == userId).AsQueryable();

            if (from != null) 
                query = query.Where(x => x.Date >= from.Value);

            if (to != null) 
            {
                var toPlusOne = to.Value.AddDays(1);
                query = query.Where(x => x.Date < toPlusOne);
            }

            return query.ToList();
        }

        public void CreateNote(Note note)
        {
            var now = DateTime.Now;
            note.Id = Guid.NewGuid().ToString();
            note.Date = note.Date;
            note.Created = now;
            note.Modified = now;
            db.Notes.Add(note);
            db.SaveChanges();
        }

        public void UpdateNote(Note note)
        {
            note.Date = note.Date;
            note.Modified = DateTime.Now;
            db.Entry(note).State = EntityState.Modified;
            db.SaveChanges();
        }

        public void DeleteNote(Note note)
        {
            db.Notes.Remove(note);
            db.SaveChanges();
        }
    }
}

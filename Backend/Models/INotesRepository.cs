using Backend.Models;
using System;
using System.Collections.Generic;

namespace Backend.Models
{
    public interface INotesRepository
    {
        Note GetById(string id);
        List<Note> GetAllNotes(string userId);
        List<Note> GetNotesByDate(string userId, DateTime? from, DateTime? to);
        void CreateNote(Note note);
        void CreateNotes(ICollection<Note> notes);
        void UpdateNote(Note note);
        void DeleteNote(Note note);
        void DeleteAllNotes(string userId);
    }
}

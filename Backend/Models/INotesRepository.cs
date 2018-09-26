using Backend.Models;
using System;
using System.Collections.Generic;

namespace Backend.Models
{
    public interface INotesRepository
    {
        Note GetById(int id);
        List<Note> GetAllNotes(string userId);
        List<Note> GetNotesByDate(string userId, DateTime? from, DateTime? to);
        void CreateNote(Note note);
        void UpdateNote(Note note);
        void DeleteNote(Note note);
    }
}

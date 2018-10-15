namespace Backend.Models
{
    public class NoteResultModel
    {
        public NoteResultModel()
        {
        }

        public NoteResultModel(Note note)
        {
            Id = note.Id;
            Date = DateFormatter.DateTimeToStr(note.Date);
            Text = note.Text;
        }

        public string Id { get; set; }
        public string Date { get; set; }
        public string Text { get; set; }
    }
}

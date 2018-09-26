using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class NoteCreateModel
    {
        [Required]
        public string Date { get; set; }
        [Required]
        public string Text { get; set; }
    }
}

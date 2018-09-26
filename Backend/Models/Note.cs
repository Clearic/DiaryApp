using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Note
    {
        public int Id { get; set; }
        [Required]
        public string UserId { get; set; }
        public User User { get; set; }
        public DateTime Date { get; set; }
        [Required]
        public string Text { get; set; }
        public DateTime Created { get; set; }
        public DateTime Modified { get; set; }
    }
}

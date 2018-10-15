using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Backend.Models
{
    public static class BackupUtils
    {
        public static void WriteNotesBackup(Stream stream, List<Note> notes)
        {
            using (var archive = new ZipArchive(stream, ZipArchiveMode.Create, true))
            {
                foreach (var note in notes)
                {
                    var entry = archive.CreateEntry(GetNoteFilename(note));
                    using (StreamWriter writer = new StreamWriter(entry.Open()))
                    {
                        writer.Write(note.Text);
                    }
                }
            }
        }

        public static List<Note> ReadNotesBackup(Stream stream, string userId)
        {
            using (var archive = new ZipArchive(stream, ZipArchiveMode.Read))
            {
                var notes = new List<Note>();

                foreach (var entry in archive.Entries)
                {
                    DateTime date = ParseDateFromNoteFileName(entry.FullName);

                    using (var entryStream = new StreamReader(entry.Open()))
                    {
                        string text = entryStream.ReadToEnd();
                        notes.Add(new Note()
                        {
                            Id = Guid.NewGuid().ToString(),
                            UserId = userId,
                            Date = date,
                            Text = text,
                            Created = DateTime.UtcNow,
                            Modified = DateTime.UtcNow
                        });
                    }
                }

                return notes;
            }
        }

        static string GetNoteFilename(Note note)
        {
            const int maxNameLen = 32;

            string filename = note.Date.ToString("yyyy-MM/dd HH_mm", CultureInfo.InvariantCulture);

            var sb = new StringBuilder();
            foreach (var c in note.Text)
            {
                if (c == '\n' || c == '\r' || sb.Length >= maxNameLen)
                    break;
                else if (GetValidPathChars().Contains(c))
                    sb.Append(c);
            }
            string name = sb.ToString().Trim();
            if (name.Length != 0)
                filename += " " + name + ".txt";

            return filename;
        }

        static IEnumerable<char> GetValidPathChars()
        {
            for (char c = 'a'; c <= 'z'; c++)
            {
                yield return c;
            }
            for (char c = 'A'; c <= 'Z'; c++)
            {
                yield return c;
            }
            for (char c = '0'; c <= '9'; c++)
            {
                yield return c;
            }
            yield return '&';
            yield return '-';
            yield return '_';
            yield return '`';
            yield return ' ';
        }

        static DateTime ParseDateFromNoteFileName(string filename)
        {
            string dateStr = filename.Substring(0, 16);
            DateTime date = DateTime.ParseExact(dateStr, "yyyy-MM/dd HH_mm", CultureInfo.InvariantCulture);
            return date;
        }
    }
}

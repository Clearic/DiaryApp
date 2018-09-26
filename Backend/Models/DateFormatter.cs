using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Models
{
    public static class DateFormatter
    {
        public const string DateFormat = "yyyy-M-d";
        public const string DateTimeFormat = "yyyy-M-d HH:mm";

        public static bool TryParseDate(string str, out DateTime date)
        {
            return DateTime.TryParseExact(
                str,
                DateFormat,
                CultureInfo.InvariantCulture,
                DateTimeStyles.None, out date);
        }

        public static string DateToStr(DateTime date)
        {
            return date.ToString(
                DateFormat,
                CultureInfo.InvariantCulture
            );
        }

        public static bool TryParseDateTime(string str, out DateTime date)
        {
            return DateTime.TryParseExact(
                str,
                DateTimeFormat,
                CultureInfo.InvariantCulture,
                DateTimeStyles.None, out date);
        }

        public static string DateTimeToStr(DateTime date)
        {
            return date.ToString(
                DateTimeFormat,
                CultureInfo.InvariantCulture
            );
        }
    }
}

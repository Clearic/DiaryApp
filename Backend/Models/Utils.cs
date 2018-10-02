using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Backend.Models
{
    public static class Utils
    {
        public static string GetUserId(HttpContext context)
        {
            var nameIdentifierClaim = context.User.Claims
                .Where(x => x.Type == ClaimTypes.NameIdentifier)
                .FirstOrDefault();

            if (nameIdentifierClaim == null)
                throw new Exception("No NameIdentifier claim");

            return nameIdentifierClaim.Value;
        }
    }
}

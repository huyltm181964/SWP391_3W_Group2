using System.ComponentModel.DataAnnotations;

namespace API.DTOs.RequestDTO
{
    public class ProfileDTO
    {
        public string? AccountEmail { get; set; }
        public IFormFile? Avatar { get; set; }
        public string AccountName { get; set; }
        public string Gender { get; set; }
        public string BirthDay { get; set; }
        public string Phone { get; set; }
        public string AccountAddress { get; set; }
    }
}

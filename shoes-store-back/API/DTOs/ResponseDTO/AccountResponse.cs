using System.ComponentModel.DataAnnotations;

namespace API.DTOs.ResponseDTO
{
    public class AccountResponse
    {
        public String AccountEmail { get; set; }
        public String? AccountName { get; set; }
        public String? Avatar { get; set; }
        public String? Gender { get; set; }
        public DateTime? BirthDay { get; set; }
        public String? Phone { get; set; }
        public String? AccountAddress { get; set; }
        public String Role { get; set; }
        public DateTime CreatedAt { get; set; }
        [MaxLength(10)]
        public String Status { get; set; }
    }
}

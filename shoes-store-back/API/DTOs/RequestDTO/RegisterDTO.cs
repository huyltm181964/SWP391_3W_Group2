using System.ComponentModel.DataAnnotations;

namespace API.DTOs.RequestDTO
{
    public class RegisterDTO
    {
        [Required(ErrorMessage =("The field is required"))]
        public string AccountEmail { get; set; }
        [Required(ErrorMessage =("The field is required"))]
        [MaxLength(255)]
        public string Password { get; set; }
        [Required(ErrorMessage = ("The field is required"))]
        public string AccountName { get; set; }
        [MaxLength(10, ErrorMessage =("Phone only 10 characters"))]
        public string Phone { get; set; }
        public string Role = "User";
        public string Status = "InActive";
    }
}

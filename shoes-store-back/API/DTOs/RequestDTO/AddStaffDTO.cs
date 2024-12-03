namespace API.DTOs.RequestDTO
{
    public class AddStaffDTO
    {
        public IFormFile? Avatar { get; set; }
        public string? AccountName { get; set; }
        public string? AccountEmail { get; set; }
        public string? Password { get; set; }
        public DateTime? Birthday { get; set; }
        public string? Phone { get; set; }
        public string? Gender { get; set; }
        public string? AccountAddress { get; set; }
        public string? Role { get; set; } = "Staff";
        public string? Status { get; set; } = "Active";
    }
}

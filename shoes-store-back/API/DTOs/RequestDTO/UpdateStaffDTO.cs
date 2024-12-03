namespace API.DTOs.RequestDTO
{
    public class UpdateStaffDTO
    {
        public int AccountID { get; set; }
        public IFormFile? Avatar { get; set; }
        public string? AccountEmail { get; set; }
        public string? AccountName { get; set; }
        public string? Gender { get; set; }
        public DateTime? Birthday { get; set; }
        public string? Phone { get; set; }
        public string? AccountAddress { get; set; }
    }
}

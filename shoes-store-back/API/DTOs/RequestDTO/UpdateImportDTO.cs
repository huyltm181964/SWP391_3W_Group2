namespace API.DTOs.RequestDTO
{
    public class UpdateImportDTO
    {
        public int ImportID { get; set; }
        public Decimal ImportPrice { get; set; }
        public string? AddressDetail { get; set; }
        public string? City { get; set; }
        public string? District { get; set; }
        public string? Ward { get; set; }
    }
}

namespace API.DTOs.RequestDTO
{
    public class ImportDTO
    {
        public int VariantID { get; set; }
        public int Quantity { get; set; }
        public Decimal ImportPrice { get; set; }
        public string? AddressDetail { get; set; }
        public string? City { get; set; }
        public string? District { get; set; }
        public string? Ward { get; set; }
    }
}

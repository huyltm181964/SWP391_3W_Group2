namespace API.DTOs.RequestDTO
{
    public class ImportDTO
    {
        public string Supplier { get; set; }
        public string Phone { get; set; }
        public string? AddressDetail { get; set; }
        public string? City { get; set; }
        public string? District { get; set; }
        public string? Ward { get; set; }
        public int ImportStaffID { get; set; }

        public List<VariantDetailDTO> VariantDetails { get; set; } = new();
    }

    public class VariantDetailDTO
    {
        public int ProductID { get; set; }
        public string? VariantSize { get; set; }
        public string? VariantColor { get; set; }
        public int Quantity { get; set; }
        public decimal ImportPrice { get; set; }
    }

}

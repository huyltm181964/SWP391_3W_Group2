namespace API.DTOs.ResponseDTO
{
    public class OrderDetailResponse
    {
        public string ProductName { get; set; }
        public string ProductImg { get; set; }
        public string ProductCategory { get; set; }
        public string ProductDescription { get; set; }
        public string VariantImg { get; set; }
        public string VariantSize { get; set; }
        public string VariantColor { get; set; }

        public int OrderQuantity { get; set; }
        public double UnitPrice { get; set; }
        public double TotalItemPrice { get; set; }
    }
}

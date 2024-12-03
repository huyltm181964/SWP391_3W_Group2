namespace API.DTOs.ResponseDTO
{
    public class VariantResponseDTO
    {
        public String? VairantImage { get; set; }
        public String? VariantSize { get; set; }
        public String? VariantColor { get; set; }
        public int VariantQuantity { get; set; }
        public int ProductID {  get; set; }
        public String? ProductName { get; set; }
        public Decimal ? ProductPrice { get; set; }
        public String ? ProductImg { get; set; }
        public String ? ProductCategory { get; set; }
        public String? ProductDescription { get; set; }
        public String ? ProductStatus {  get; set; }
    }
}

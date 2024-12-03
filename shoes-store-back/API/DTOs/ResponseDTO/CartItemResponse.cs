using System.ComponentModel.DataAnnotations;

namespace API.DTOs.ResponseDTO
{
    public class CartItemResponse
    {
        public int VariantID { get; set; }
        public string? VariantImg { get; set; }
        public string? VariantSize { get; set; }
        public string? VariantColor { get; set; }
        public string? ProductName { get; set; }
        public double? ProductPrice { get; set; }
        public string? ProductImg { get; set; }
        public string? ProductCategory { get; set; }
        public string? ProductDescription { get; set; }
        public int Quantity { get; set; }
    }
}

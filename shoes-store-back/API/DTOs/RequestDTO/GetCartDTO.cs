using System.ComponentModel.DataAnnotations;

namespace API.DTOs.RequestDTO
{
    public class GetCartDTO
    {
        public string? ProductName { get; set; }
        public decimal ProductPrice { get; set; }
        public string? ProductImg { get; set; }

        public string? ProductCategory { get; set; }

        public string? ProductDescription { get; set; }

        public string? ProductStatus { get; set; }

        public string? VariantImg { get; set; }
        [MaxLength(3)]
        public string? VariantSize { get; set; }
        [MaxLength(20)]
        public string? VariantColor { get; set; }

        public int VariantQuantity { get; set; }
    }
}

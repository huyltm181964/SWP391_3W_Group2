using System.ComponentModel.DataAnnotations;

namespace API.DTOs.RequestDTO
{
    public class AddProductDTO
    {
        public string ProductName { get; set; }
        public decimal ProductPrice { get; set; }
        public IFormFile ProductImg { get; set; }
        [MaxLength(500)]
        public string ProductCategory { get; set; }
        [MaxLength(500)]
        public string ProductDescription { get; set; }
        [MaxLength(500)]
        public string ProductStatus { get; set; } = "In business";
    }
}

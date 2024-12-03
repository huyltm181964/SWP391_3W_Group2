using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class Product
    {
        [Key]
        public int ProductID { get; set; }
        [MaxLength(500)]
        public String ProductName { get; set; }
        public Decimal ProductPrice { get; set; }
        [MaxLength(500)]
        public String ProductImg { get; set; }
        [MaxLength(500)]
        public String ProductCategory { get; set; }
        [MaxLength(500)]
        public String ProductDescription { get; set; }
        [MaxLength(500)]
        public String ProductStatus { get; set; }

        public virtual ICollection<ProductVariant> ProductVariants { get; set; } = [];
        public virtual ICollection<Comment> Comments { get; set; } = [];
    }
}

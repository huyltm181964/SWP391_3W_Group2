using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class ProductVariant
    {
        [Key]
        public int VariantID { get; set; }
        public String VariantImg { get; set; }
        [MaxLength(3)]
        public String VariantSize { get; set; }
        [MaxLength(20)]
        public String VariantColor { get; set; }
        public int VariantQuantity { get; set; }
        public bool IsStopSelling { get; set; } = false;

        public int ProductID { get; set; }
        public virtual Product? Product { get; set; }

        public virtual ICollection<Import> Imports { get; set; } = [];
        public virtual ICollection<Export> Exports { get; set; } = [];
    }
}

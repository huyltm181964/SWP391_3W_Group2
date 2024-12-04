using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class Export
    {
        [Key]
        public int ExportID { get; set; }
        public int Quantity { get; set; }
        public DateTime ExportDate { get; set; }
        [MaxLength(255)]
        public String ExportLocation { get; set; }
        public int VariantID { get; set; }
        [ForeignKey(nameof(VariantID))]
        public virtual ProductVariant? ProductVariant { get; set; }
    }
}

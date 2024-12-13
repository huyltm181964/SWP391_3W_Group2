using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class Import
    {
        [Key]
        public int ImportID { get; set; }
        public DateTime ImportDate { get; set; }
        [MaxLength(100)]
        public required String Supplier { get; set; }
        [MaxLength(255)]
        public String ImportLocation { get; set; }

        public virtual ICollection<ImportDetail> ImportDetails { get; set; } = [];
    }
}
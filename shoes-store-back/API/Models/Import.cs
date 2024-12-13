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
        [MaxLength(11)]
        public required String Phone { get; set; }

        public int ImportStaffID { get; set; }
        [ForeignKey(nameof(ImportStaffID))]
        public virtual Account? ImportStaff { get; set; }

        public virtual ICollection<ImportDetail> ImportDetails { get; set; } = [];
    }
}
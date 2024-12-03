using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    [PrimaryKey(nameof(AccountID), nameof(ProductID))]
    public class Comment
    {
        public int ProductID { get; set; }
        public int AccountID { get; set; }
        public required Decimal Rate { get; set; }
        [MaxLength(255)]
        public String Content { get; set; }
        public DateTime CreatedDate { get; set; }
        public virtual Account Account { get; set; }
        public virtual Product Product { get; set; }
    }
}

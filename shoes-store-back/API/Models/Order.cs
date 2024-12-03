using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class Order
    {
        [Key]
        public int OrderID { get; set; }
        public int AccountID { get; set; }
        [MaxLength(255)]
        public String OrderAddress { get; set; }
        public Decimal TotalPrice { get; set; }
        public DateTime OrderDate { get; set; }
        [MaxLength(100)]
        public String OrderStatus { get; set; }

        public virtual Account Account { get; set; }
        public virtual ICollection<OrderDetail> OrderDetails { get; set; } = [];
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class Cart
    {
        [Key]
        public int CartID { get; set; }
        public Decimal TotalPrice { get; set; }
        public virtual ICollection<CartItem> CartItems { get; set; } = [];
    }
}

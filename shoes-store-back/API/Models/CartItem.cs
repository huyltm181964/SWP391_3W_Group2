using Microsoft.EntityFrameworkCore;

namespace API.Models
{
    [PrimaryKey(nameof(CartID), nameof(VariantID))]
    public class CartItem
    {
        public int CartID { get; set; }
        public int VariantID { get; set; }
        public int Quantity { get; set; }
        public Decimal TotalItemPrice {  get; set; }
        public virtual Cart? Cart { get; set; }
        public virtual ProductVariant? Variant { get; set; }
    }
}

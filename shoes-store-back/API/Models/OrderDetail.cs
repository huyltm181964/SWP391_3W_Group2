using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    [PrimaryKey(nameof(OrderID), nameof(VariantID))]
    public class OrderDetail
    {
        public int OrderID { get; set; }
        public int VariantID { get; set; }
        public int Quantity { get; set; }
        public Decimal UnitPrice {  get; set; }
        public bool IsExported { get; set; } = false;
        public virtual Order Order { get; set; }
        public virtual ProductVariant Variant { get; set; }
    }
}

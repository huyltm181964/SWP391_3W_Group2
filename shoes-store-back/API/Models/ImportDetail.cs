using Microsoft.EntityFrameworkCore;

namespace API.Models
{
    [PrimaryKey(nameof(ImportID), nameof(VariantID))]
    public class ImportDetail
    {
        public int ImportID { get; set; }
        public virtual Import? Import { get; set; }

        public int VariantID { get; set; }
        public virtual ProductVariant? Variant { get; set; }

        public int Quantity { get; set; }
        public Decimal UnitPrice { get; set; }
    }
}

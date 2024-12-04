using Microsoft.EntityFrameworkCore;

namespace API.Models
{
    [PrimaryKey(nameof(AccountID), nameof(ProductID))]
    public class BlacklistComment
    {
        public int AccountID { get; set; }
        public virtual Account? Account { get; set; }

        public int ProductID { get; set; }
        public virtual Product? Product { get; set; }

        public String Reason { get; set; }
    }
}

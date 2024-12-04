using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class Notification
    {
        [Key]
        public int NotificationID { get; set; }
        public String Title { get; set; }
        public String Description { get; set; }
        public bool IsRead { get; set; } = false;
        public int AccountID { get; set; }
        public virtual Account? Account { get; set; }
    }
}

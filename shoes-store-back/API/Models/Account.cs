using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class Account
    {
        [Key]
        public int AccountID { get; set; }
        [Required]
        [MaxLength(50)]
        public String AccountEmail { get; set; }
        [MaxLength(32)]
        [Required]
        public String Password { get; set; }
        [MaxLength(32)]
        public String? AccountName { get; set; }
        public String? Avatar { get; set; }
        [MaxLength(10)]
        public String? Gender { get; set; }
        public DateTime? BirthDay { get; set; }
        [MaxLength(11)]
        public String? Phone { get; set; }
        [MaxLength(255)]
        public String? AccountAddress { get; set; }
        [MaxLength(10)]
        [Required]
        public String Role { get; set; }
        public DateTime CreatedAt { get; set; }
        [MaxLength(10)]
        public String Status { get; set; }

        public int CartID { get; set; }
        public virtual Cart? Cart { get; set; }

        public virtual ICollection<BlacklistComment> BlacklistComments { get; set; } = [];
        public virtual ICollection<Comment> Comments { get; set; } = [];
        public virtual ICollection<Contact> Contacts { get; set; } = [];
        public virtual ICollection<Notification> Notifications { get; set; } = [];
        public virtual ICollection<Order> Orders { get; set; } = [];
        public virtual ICollection<Import> Imports { get; set; } = [];
    }
}

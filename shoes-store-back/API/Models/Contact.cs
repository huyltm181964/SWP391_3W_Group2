using System.ComponentModel.DataAnnotations;

namespace API.Models
{
    public class Contact
    {
        [Key]
        public int ContactID { get; set; }
        [MaxLength(255)]
        public String Title { get; set; }
        [MaxLength(500)]
        public String Description { get; set; }
        public DateTime CreatedDate { get; set; }
        [MaxLength(500)]
        public String Answer { get; set; }
        public DateTime AnswerDate { get; set; }
        public bool IsRejected { get; set; } = false;

        public int AccountID { get; set; }
        public virtual Account? Account { get; set; }
    }
}

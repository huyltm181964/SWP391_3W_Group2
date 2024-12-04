namespace API.DTOs.RequestDTO
{
    public class CommentIdDTO
    {
        public int AccountID { get; set; }
        public int ProductID { get; set; }
    }

    public class CommentBanDTO
    {
        public CommentIdDTO CommentIdDTO { get; set; }
        public String Reason { get; set; }
    }
}

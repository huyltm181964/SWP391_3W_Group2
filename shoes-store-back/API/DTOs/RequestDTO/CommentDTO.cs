namespace API.DTOs.RequestDTO
{
    public class CommentDTO
    {
        public int ProductID { get; set; }
        public Decimal Rate { get; set; }
        public string? Content { get; set; }
    }
}

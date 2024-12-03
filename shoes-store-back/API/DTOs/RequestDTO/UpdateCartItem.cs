namespace API.DTOs.RequestDTO
{
    public class UpdateCartItem
    {
        public int UserID { get; set; }
        public int VariantID { get; set; }
        public int Quantity { get; set; }
    }
}

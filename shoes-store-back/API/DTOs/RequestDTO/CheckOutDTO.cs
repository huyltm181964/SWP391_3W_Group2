namespace API.DTOs.RequestDTO
{
    public class CheckOutDTO
    {
        public int AccountID { get; set; }
        public string OrderAddress { get; set; }
        public List<int> VariantID { get; set; }

    }
}

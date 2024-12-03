namespace API.DTOs
{
    public class CheckOutReponse
    {
        public int OrderID { get; }
        public String OrderAddress {  get; set; }
        public double TotalPrice {  get; set; }
        public DateTime OrderDate { get; set; }
        public String OrderStatus {  get; set; }

    }
}

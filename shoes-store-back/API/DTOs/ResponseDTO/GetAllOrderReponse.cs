namespace API.DTOs.ResponseDTO
{
    public class GetAllOrderReponse
    {
        public String? AccountEmail { get; set; }
        public String? AccountName { get; set; }
        public String? Phone { get; set; }
        public String? AccountAddress { get; set; }
        public String? OrderAddress { get; set; }
        public DateTime OrderDate { get; set; }

        public Decimal TotalPrice { get; set; }
    }
}

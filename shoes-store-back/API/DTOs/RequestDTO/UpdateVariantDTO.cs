namespace API.DTOs.RequestDTO
{
    public class UpdateVariantDTO
    {
        public int VariantID { get; set; }
        public IFormFile? VariantImage { get; set; }
        public String? VariantSize { get; set; }
        public String? VariantColor { get; set; }
    }
}

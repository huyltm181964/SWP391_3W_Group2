namespace API.DTOs.RequestDTO
{
    public class CreateVariantDTO
    {
        public int ProductID { get; set; }
        public IFormFile? VariantImage { get; set; }
        public String? VariantSize {  get; set; }
        public String? VariantColor {  get; set; }
    }
}

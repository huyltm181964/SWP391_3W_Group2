using System.ComponentModel.DataAnnotations;

namespace API.DTOs.ResponseDTO
{
    public class CommentResponseDTO
    {
        public String? AccountName {  get; set; }
        public String? Content {  get; set; }
        [DisplayFormat(DataFormatString = "{0:ddMMyyyy}")]
        public DateTime? CommentDate { get; set; }
    }
}

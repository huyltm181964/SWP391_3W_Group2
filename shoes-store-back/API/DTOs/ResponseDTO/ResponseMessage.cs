namespace API.DTOs.ResponseDTO
{
    public class ResponseMessage
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public object? Data { get; set; }
        public int StatusCode { get; set; }
    }
}

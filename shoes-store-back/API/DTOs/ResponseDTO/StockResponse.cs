﻿namespace API.DTOs.ResponseDTO
{
    public class StockResponse
    {
        public int? Id { get; set; }
        public string? Location { get; set; }
        public DateTime? Date { get; set; }
        public int? Quantity { get; set; }
        public string? Type { get; set; } 
        public Decimal? UnitPrice { get; set; }
    }
}

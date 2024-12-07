using API.DAO;
using API.DTOs.RequestDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Staff
{
    [Route("api/v1/staff/export")]
    [ApiController]
    [Authorize(Roles = "Staff")]
    public class StaffExportController : ControllerBase
    {
        private readonly OrderDAO orderDAO;
        private readonly ExportDAO exportDAO;
        public StaffExportController(OrderDAO orderDAO, ExportDAO exportDAO)
        {
            this.orderDAO = orderDAO;
            this.exportDAO = exportDAO;
        }

        [HttpGet("get-export-order")]
        public IActionResult GetOrderedOrder()
        {
            var response = orderDAO.GetOrderByStatus("Ordered");
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("export")]
        public IActionResult Export([FromBody] ExportDTO dto)
        {
            var response = exportDAO.ExportOrderDetail(dto.OrderID, dto.VariantID);
            if (response.Data != null)
            {
                orderDAO.UpdateOrderStatus(dto.OrderID, response.Data.ToString()!);
            }
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("export-all")]
        public IActionResult ExportAll([FromBody] int orderID)
        {
            var response = exportDAO.ExportAllOrderDetailInOrder(orderID);
            if (response.StatusCode == 200)
            {
                orderDAO.UpdateOrderStatus(orderID, "Delivery");
            }
            return StatusCode(response.StatusCode, response);
        }
    }
}

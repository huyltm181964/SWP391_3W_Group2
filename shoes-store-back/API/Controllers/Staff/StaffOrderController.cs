using API.DAO;
using API.DTOs.RequestDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Staff
{
    [Route("api/v1/staff/order")]
    [ApiController]
    [Authorize(Roles = "Staff")]
    public class StaffOrderController : ControllerBase
    {
        private readonly OrderDAO orderDAO;
        public StaffOrderController(OrderDAO orderDAO)
        {
            this.orderDAO = orderDAO;
        }

        [HttpGet]
        public IActionResult GetAllOrder()
        {
            var response = orderDAO.GetAllOrder();
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("confirm-order")]
        public IActionResult ConfirmOrder([FromBody] int orderID)
        {
            var response = orderDAO.ConfirmOrder(orderID);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("complete-order")]
        public IActionResult CompleteOrder([FromBody] int orderID)
        {
            var response = orderDAO.UpdateOrderStatus(orderID, "Completed");
            return StatusCode(response.StatusCode, response);
        }
    }
}

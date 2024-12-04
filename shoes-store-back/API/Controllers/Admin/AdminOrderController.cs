using API.DAO;
using API.DTOs.RequestDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Ocsp;

namespace API.Controllers.Admin
{
    [ApiController]
    [Route("api/v1/admin/order")]
    [Authorize(Roles = "Admin")]
    public class AdminOrderController : Controller
    {
        private readonly OrderDAO dao;
        public AdminOrderController(OrderDAO dao)
        {
            this.dao = dao;
        }

        [HttpGet("get-all"), Authorize]
        public IActionResult GetAllOrder()
        {
            var response = dao.GetOrderedOrder();
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("update-order"), Authorize]
        public IActionResult UpdateOrderStatus([FromForm] UpdateOrderDTO updateOrderDTO)
        {
            var response = dao.UpdateOrderStatus(updateOrderDTO.orderID, updateOrderDTO.orderStatus);
            return StatusCode(response.StatusCode, response);
        }
    }
}

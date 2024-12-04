using API.DAO;
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
            //var response = dao.GetAllOrder();
            //return StatusCode(response.StatusCode, response);
            return null;
        }

        [HttpPost("update-order"), Authorize]
        public IActionResult UpdateOrderStatus([FromBody] int orderID)
        {
            //var response = dao.UpdateOrderStatus(orderID);
            //return StatusCode(response.StatusCode, response);
            return null;
        }
    }
}

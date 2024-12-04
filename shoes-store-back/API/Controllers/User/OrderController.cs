using API.DAO;
using API.DTOs.RequestDTO;
using API.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.User
{
    [ApiController]
    [Route("api/v1/order")]
    public class OrderController : Controller
    {
        private readonly OrderDAO dao;
        public OrderController(OrderDAO dao)
        {
            this.dao = dao;
        }

        [HttpPost("check-out"), Authorize]
        public IActionResult CheckOut([FromBody] CheckOutDTO checkoutDTO)
        {
            var user = JWTHandler.GetUserIdFromHttpContext(HttpContext);
            checkoutDTO.AccountID = user;
            var reponse = dao.CheckOut(checkoutDTO);
            return StatusCode(reponse.StatusCode, reponse);
        }

        [HttpGet("get-order"), Authorize]
        public IActionResult GetOrderByAccount()
        {
            var user = JWTHandler.GetUserIdFromHttpContext(HttpContext);
            var response = dao.GetOrderByAccount(user);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("cancel-order/{orderID}"), Authorize]
        public IActionResult CancelOrder(int orderID)
        {
            var response = dao.CancelOrder(orderID);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("payment-url/{orderID}"), Authorize]
        public IActionResult GetPaymentURL(int orderID)
        {
            var response = dao.GetPaymentURL(orderID);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("confirm")]
        public IActionResult ConfirmOrder([FromBody] int orderID) { 
            var response = dao.UpdateOrderStatus(orderID, "Completed");
            return StatusCode(response.StatusCode, response);
        }
    }
}

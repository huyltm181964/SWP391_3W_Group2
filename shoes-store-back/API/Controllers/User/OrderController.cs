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
        private readonly IConfiguration configuration;
        public OrderController(OrderDAO dao, IConfiguration configuration)
        {
            this.dao = dao;
            this.configuration = configuration;
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
            var ipAddress = Request.HttpContext.Connection.RemoteIpAddress;
            var response = dao.GetPaymentURL(orderID, ipAddress, configuration);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("verify/{orderID}"), Authorize]
        public IActionResult VerifyOrder(int orderID)
        {
            var response = dao.VerifyOrder(orderID);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("confirm")]
        public IActionResult ConfirmOrder([FromBody] int orderID) { 
            var response = dao.UpdateOrderStatus(orderID, "Completed");
            return StatusCode(response.StatusCode, response);
        }
    }
}

using API.DAO;
using API.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.User
{
    [Route("api/v1/notification")]
    [ApiController]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly NotificationDAO notificationDAO;
        public NotificationController(NotificationDAO notificationDAO)
        {
            this.notificationDAO = notificationDAO;
        }

        [HttpGet]
        public IActionResult GetAllNotifications()
        {
            var accountID = JWTHandler.GetUserIdFromHttpContext(HttpContext);
            var response = notificationDAO.GetAllNotifications(accountID);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("{notificationID}")]
        public IActionResult GetNotificationDetail(int notificationID)
        {
            var accountID = JWTHandler.GetUserIdFromHttpContext(HttpContext);
            var response = notificationDAO.GetNotificationDetail(accountID, notificationID);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("clear")]
        public IActionResult ClearAllNotifications()
        {
            var accountID = JWTHandler.GetUserIdFromHttpContext(HttpContext);
            var response = notificationDAO.ClearNotifications(accountID);
            return StatusCode(response.StatusCode, response);
        }
    }
}

using API.DAO;
using API.DTOs.RequestDTO;
using API.Utils;
using API.Utils.Ultils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.User
{
    [ApiController]
    [Route("api/v1/account")]
    public class AccountController : Controller
    {
        private readonly AccountDAO dao;
        public AccountController(AccountDAO _dao)
        {
            dao = _dao;
        }

        [HttpGet("get-profile"), Authorize]
        public IActionResult GetProfileByID()
        {
            var user = JWTHandler.GetUserIdFromHttpContext(HttpContext);
            var response = dao.GetProfileByID(user);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPut("change-password"), Authorize]
        public IActionResult ChangePassword([FromForm] ChangePasswordDTO changePasswordDTO)
        {
            var user = JWTHandler.GetUserIdFromHttpContext(HttpContext);
            var response = dao.ChangePassword(user, changePasswordDTO);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPut("update-profile"), Authorize]
        public IActionResult UpdateProfile([FromForm] ProfileDTO profileDTO)
        {
            var user = JWTHandler.GetUserIdFromHttpContext(HttpContext);
            var response = dao.UpdateProfile(user, profileDTO);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("contact"), Authorize]
        public IActionResult Contact([FromForm] ContactUsDTO contactUsDTO)
        {
            Ultils.sendMail("huynlnce181196@fpt.edu.vn", $"Hello, My name is {contactUsDTO.Name}\n I contact you with message: {contactUsDTO.Message}", "Contact from " + contactUsDTO.Email);
            return StatusCode(200, new { success = true });
        }
    }
}

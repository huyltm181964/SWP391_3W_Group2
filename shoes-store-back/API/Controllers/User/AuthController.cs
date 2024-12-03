using API.DAO;
using API.DTOs.RequestDTO;
using API.Utils;
using API.Utils.Ultils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers.User
{
    [ApiController]
    [Route("api/v1/auth")]
    public class AuthController : Controller
    {
        private readonly AuthenticationDAO dao;
        public AuthController(AuthenticationDAO dao)
        {
            this.dao = dao;
        }

        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginDTO account)
        {
            var response = dao.Login(account.AccountEmail, account.Password);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("login-google")]
        public IActionResult LoginWithGoogle([FromBody] LoginGoogleDTO loginGoogleDTO)
        {
            var response = dao.LoginWithGoogle(loginGoogleDTO);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("Register")]
        public IActionResult Register([FromBody] RegisterDTO registerDTO)
        {
            var response = dao.Register(registerDTO);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("forgot-password")]
        public IActionResult ForgotPassword([FromBody] String accountEmail)
        {
            var response = dao.ForgotPassword(accountEmail);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("send-mail")]
        public IActionResult SendMail([FromBody] String accountEmail)
        {
            var response = Ultils.sendMail(accountEmail, Ultils.RandomOTP(), "Your OTP is");
            return Ok(response);
        }

        [HttpPost("active")]
        public IActionResult ActiveAccount([FromBody] string accountEmail)
        {
            var response = dao.ActiveAccount(accountEmail);
            return StatusCode(response.StatusCode, response);
        }
    }
}

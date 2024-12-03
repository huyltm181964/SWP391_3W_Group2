using API.DAO;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Admin
{
    [ApiController]
    [Route("api/v1/admin/account")]
    [Authorize(Roles = "Admin")]
    public class AdminAccountController : Controller
    {
        private readonly AuthenticationDAO dao;
        public AdminAccountController(AuthenticationDAO dao) { 
            this.dao = dao;
        }

        [HttpGet("get-all")]
        public IActionResult GetAll()
        {
            var response = dao.GetAllAccount();
            return StatusCode(response.StatusCode,response);
        }

        [HttpPost("update-status")]
        public IActionResult UpdateAccontStatus([FromBody] String accountEmail)
        {
            var response = dao.UpdateAccountStatus(accountEmail);
            return StatusCode(response.StatusCode,response);
        }
    }
}

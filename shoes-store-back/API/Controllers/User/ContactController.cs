using API.DAO;
using API.DTOs.RequestDTO;
using API.Utils;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.User
{
    [Route("api/v1/contact")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly ContactDAO contactDAO;
        public ContactController(ContactDAO contactDAO)
        {
            this.contactDAO = contactDAO;
        }

        [HttpPost("add-contact")]
        public IActionResult AddContact([FromBody] ContactUsDTO contactUsDTO)
        {
            var accountID = JWTHandler.GetUserIdFromHttpContext(HttpContext);
            var response = contactDAO.AddContact(accountID, contactUsDTO);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("history-contact")]
        public IActionResult HistoryContact()
        {
            var accountID = JWTHandler.GetUserIdFromHttpContext(HttpContext);
            var response = contactDAO.GetUserHistoryContact(accountID);
            return StatusCode(response.StatusCode, response);
        }
    }
}

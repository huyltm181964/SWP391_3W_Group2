using API.DAO;
using API.DTOs.RequestDTO;
using API.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Staff
{
    [Route("api/v1/staff/contact")]
    [ApiController]
    [Authorize(Roles = "Staff")]
    public class StaffContactController : ControllerBase
    {
        private readonly ContactDAO contactDAO;
        public StaffContactController(ContactDAO contactDAO)
        {
            this.contactDAO = contactDAO;
        }

        [HttpGet]
        public IActionResult GetAllContact()
        {
            var response = contactDAO.GetAllContact();
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("answer")]
        public IActionResult AnswerContact([FromBody] ContactAnswerDTO contactAnswerDTO)
        {
            var staffID = JWTHandler.GetUserIdFromHttpContext(HttpContext);
            var response = contactDAO.AnswerContact(contactAnswerDTO.ContactID, contactAnswerDTO.Answer, staffID);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("reject/{contactID}")]
        public IActionResult RejectContact(int contactID)
        {
            var staffID = JWTHandler.GetUserIdFromHttpContext(HttpContext);
            var response = contactDAO.RejectContact(contactID, staffID);
            return StatusCode(response.StatusCode, response);
        }
    }
}

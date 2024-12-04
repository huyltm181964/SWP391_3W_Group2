using API.DAO;
using API.DTOs.RequestDTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Staff
{
    [Route("api/v1/staff/contact")]
    [ApiController]
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
            var response = contactDAO.GetUnanswerContact();
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("answer")]
        public IActionResult AnswerContact([FromBody] ContactAnswerDTO contactAnswerDTO)
        {
            var response = contactDAO.AnswerContact(contactAnswerDTO.ContactID, contactAnswerDTO.Answer);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("reject/{contactID}")]
        public IActionResult RejectContact(int contactID)
        {
            var response = contactDAO.RejectContact(contactID);
            return StatusCode(response.StatusCode, response);
        }
    }
}

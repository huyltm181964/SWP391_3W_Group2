using API.DAO;
using API.DTOs.RequestDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Staff
{
    [Route("api/v1/staff/comment")]
    [ApiController]
    [Authorize(Roles = "Staff")]
    public class StaffCommentController : ControllerBase
    {
        private readonly CommentDAO commentDAO;
        public StaffCommentController(CommentDAO commentDAO)
        {
            this.commentDAO = commentDAO;
        }

        [HttpGet]
        public IActionResult GetAllReportedComment()
        {
            var response = commentDAO.GetAllReportedComment();
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("/unreport")]
        public IActionResult UnreportComment([FromBody] CommentIdDTO commentIdDTO)
        {
            var response = commentDAO.UnreportComment(commentIdDTO.AccountID, commentIdDTO.ProductID);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("/ban")]
        public IActionResult BanComment([FromBody] CommentBanDTO commentBanDTO)
        {
            var response = commentDAO.BanComment(commentBanDTO.CommentIdDTO.AccountID,
                commentBanDTO.CommentIdDTO.ProductID,
                commentBanDTO.Reason);
            return StatusCode(response.StatusCode, response);
        }
    }
}

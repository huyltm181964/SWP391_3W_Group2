using API.DAO;
using API.DTOs.RequestDTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Admin
{
    [Route("api/v1/admin/comment")]
    [ApiController]
    public class AdminCommentController : ControllerBase
    {
        private readonly CommentDAO commentDAO;
        public AdminCommentController(CommentDAO commentDAO)
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

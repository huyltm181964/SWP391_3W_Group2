using API.DAO;
using API.DTOs.RequestDTO;
using API.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.User
{
    [ApiController]
    [Route("api/v1/comment")]
    public class CommentController : Controller
    {
        private readonly CommentDAO dao;
        public CommentController(CommentDAO dao)
        {
            this.dao = dao;
        }

        [HttpPost("create-comment"), Authorize]
        public IActionResult CreateComment([FromBody] CommentDTO commentDTO)
        {
            var accountID = JWTHandler.GetUserIdFromHttpContext(HttpContext);
            var response = dao.CreateComment(accountID, commentDTO);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("get-comment"), Authorize]
        public IActionResult GetCommentInProduct(int productID)
        {
            var user = JWTHandler.GetUserIdFromHttpContext(HttpContext);
            var response = dao.GetCommentInProduct(user, productID);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("delete-comment/{productID}"), Authorize]
        public IActionResult DeleteComment(int productID) {
            var accountID = JWTHandler.GetUserIdFromHttpContext(HttpContext);
            var reponse = dao.DeleteComment(accountID, productID);
            return StatusCode(reponse.StatusCode,reponse);
        }

        [HttpPut("update-comment"), Authorize]
        public IActionResult UpdateComment([FromBody] CommentDTO commentDTO)
        {
            var accountID = JWTHandler.GetUserIdFromHttpContext(HttpContext);
            var reponse = dao.UpdateComment(accountID, commentDTO);
            return StatusCode(reponse.StatusCode, reponse);
        }
    }
}

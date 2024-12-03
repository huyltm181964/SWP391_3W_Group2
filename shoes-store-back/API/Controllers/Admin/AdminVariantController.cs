using API.DAO;
using API.DTOs.RequestDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Admin
{
    [ApiController]
    [Route("api/v1/admin/variant")]
    [Authorize(Roles = "Admin")]
    public class AdminVariantController : Controller
    {
        private readonly VariantDAO dao;
        public AdminVariantController(VariantDAO dao)
        {
            this.dao = dao;
        }

        [HttpPost("add"), Authorize]
        public IActionResult CreateVariant([FromForm] CreateVariantDTO variantDTO)
        {
            var response = dao.CreateVariant(variantDTO);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("update")]
        public IActionResult UpdateVariant([FromForm] UpdateVariantDTO updateVariantDTO)
        {
            var response = dao.UpdateVariant(updateVariantDTO);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("update-quantity")]
        public IActionResult UpdateQuantity([FromBody] RestockDTO restockDTO)
        {
            var response = dao.UpdateVariantQuantity(restockDTO);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("delete")]
        public IActionResult SoftDelete([FromBody] int variantID)
        {
            var reponse = dao.DeleteVariant(variantID);
            return StatusCode(reponse.StatusCode, reponse);
        }
    }
}

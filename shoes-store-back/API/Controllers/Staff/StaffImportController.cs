using API.DAO;
using API.DTOs.RequestDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers.Staff
{
    [Route("api/v1/staff/import")]
    [ApiController]
    [Authorize(Roles = "Staff")]
    public class StaffImportController : ControllerBase
    {
        private readonly ImportDAO importDAO;

        public StaffImportController(ImportDAO importDAO)
        {
            this.importDAO = importDAO;
        }

        [HttpGet("get-products")]
        public IActionResult GetProducts()
        {
            var response = importDAO.GetProducts();
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("detail/{productId}")]
        public IActionResult ProductDetail(int productId)
        {
            var response = importDAO.GetDetail(productId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("get-stock-history")]
        public IActionResult GetProductStockHistory(int variantId)
        {
            var response = importDAO.GetProductHistory(variantId);
            return StatusCode(response.StatusCode, response);
        }
    }
}

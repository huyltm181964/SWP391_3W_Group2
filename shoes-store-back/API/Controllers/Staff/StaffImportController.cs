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
        private readonly ProductDAO productDAO;

        public StaffImportController(ProductDAO productDAO)
        {
            this.productDAO = productDAO;
        }

        [HttpGet("get-products")]
        public IActionResult GetProducts()
        {
            var response = productDAO.GetProducts();
            return StatusCode(response.StatusCode, response);
        }

    }
}

using API.DAO;
using API.DTOs.RequestDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.Admin
{
    [ApiController]
    [Route("api/v1/admin/product")]
    [Authorize(Roles = "Admin")]
    public class AdminProductController : Controller
    {
        private readonly ProductDAO dao;
        public AdminProductController(ProductDAO dao)
        {

            this.dao = dao;
        }

        [HttpGet("get-products"), Authorize]
        public IActionResult GetProducts()
        {
            var response = dao.GetProducts();
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("add-product"), Authorize]
        public IActionResult AddProduct([FromForm] AddProductDTO product)
        {
            var response = dao.AddProduct(product);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("update-product"), Authorize]
        public IActionResult UpdateProduct([FromForm] UpdateProductDTO updateProductDTO)
        {

            var response = dao.UpdateProduct(updateProductDTO);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("delete-product"), Authorize]
        public IActionResult DeleteProduct([FromBody] int productID)
        {
            var response = dao.DeleteProduct(productID);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("detail/{productId}"), Authorize]
        public IActionResult ProductDetail(int productId)
        {
            var response = dao.GetDetail(productId);
            return StatusCode(response.StatusCode, response);
        }
    }
}

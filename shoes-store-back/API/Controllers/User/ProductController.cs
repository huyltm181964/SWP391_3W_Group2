using API.DAO;
using API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.User
{
    [ApiController]
    [Route("api/v1/product")]
    public class ProductController : Controller
    {
        private readonly ProductDAO dao;
        public ProductController(ProductDAO dao)
        {
            this.dao = dao;
        }

        [HttpGet("get-products")]
        public IActionResult GetProducts()
        {
            var response = dao.GetProducts();
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("detail/{productId}")]
        public IActionResult ProductDetail(int productId)
        {
            var response = dao.GetDetail(productId);
            return StatusCode(response.StatusCode, response);
        }

        [HttpPost("search-product")]
        public IActionResult SearchProduct([FromBody] object productName)
        {
            string productNameStr = productName?.ToString();
            var response = dao.SearchProduct(productNameStr);
            return StatusCode(response.StatusCode, response);
        }
    }
}

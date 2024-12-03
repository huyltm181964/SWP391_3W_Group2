using API.DAO;
using API.DTOs.RequestDTO;
using API.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers.User
{
    [ApiController]
    [Route("api/v1/cart")]
    public class CartController : Controller
    {
        private readonly CartDAO dao;
        public CartController(CartDAO _dao)
        {
            dao = _dao;
        }

        [HttpPost("add-cart"), Authorize]
        public IActionResult AddToCart([FromForm] CartItemDTO itemCart)
        {
            var user = JWTHandler.GetUserIdFromHttpContext(HttpContext);
            var response = dao.AddCartItem(user, itemCart);
            return StatusCode(response.StatusCode, response);
        }

        [HttpGet("get-cart"), Authorize]
        public IActionResult GetCart()
        {
            var user = JWTHandler.GetUserIdFromHttpContext(HttpContext);
            var response = dao.GetCartByAccuont(user);
            return StatusCode(response.StatusCode, response);
        }

        [HttpDelete("delete-item/{variantID}"), Authorize]
        public IActionResult DeleteCart(int variantID)
        {
            var user = JWTHandler.GetUserIdFromHttpContext(HttpContext);
            var response = dao.DeleteCartItem(user, variantID);
            return StatusCode(response.StatusCode, response);

        }

        [HttpPut("update-cart"), Authorize]
        public IActionResult UpdateCartItem([FromForm] UpdateCartItem cartItem)
        {
            var user = JWTHandler.GetUserIdFromHttpContext(HttpContext);
            cartItem.UserID = user;
            var reponse = dao.UpdateItem(cartItem);
            return StatusCode(reponse.StatusCode, reponse);
        }
    }
}

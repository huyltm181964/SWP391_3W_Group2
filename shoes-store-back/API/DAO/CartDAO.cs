using API.Data;
using API.DTOs.RequestDTO;
using API.DTOs.ResponseDTO;
using API.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace API.DAO
{
    public class CartDAO
    {
        private readonly ShoesDbContext db;
        private readonly IMapper m;
        public CartDAO(ShoesDbContext _db, IMapper _m)
        {
            this.db = _db;
            this.m = _m;
        }

        public ResponseMessage AddCartItem(int accountID, CartItemDTO itemCart)
        {
            var account = db.Account.Include(c => c.Cart).FirstOrDefault(x => x.AccountID == accountID);
            var variant = db.ProductVariant.Include(x => x.Product).FirstOrDefault(x => x.VariantID == itemCart.VariantID);
            var checkItemAlready = db.CartItem.Include(x => x.Variant)
                                          .ThenInclude(p => p.Product)
                                          .Include(x => x.Cart)
                                          .FirstOrDefault(x => x.VariantID == itemCart.VariantID);
            if (checkItemAlready != null)
            {
                checkItemAlready.Quantity = checkItemAlready.Quantity + itemCart.Quantity;
                db.CartItem.Update(checkItemAlready);
                TotalItemPrice(checkItemAlready.VariantID);
                TotalPriceCart(accountID);
                db.SaveChanges();

                return new ResponseMessage
                {
                    Success = true,
                    Message = "Success",
                    Data = m.Map<CartItemResponse>(checkItemAlready),
                    StatusCode = (int)HttpStatusCode.OK
                };
            }

            CartItem addItem = new CartItem
            {
                Cart = account.Cart,
                CartID = account.CartID,
                Quantity = itemCart.Quantity,
                VariantID = itemCart.VariantID,
                Variant = variant,
                TotalItemPrice = variant.Product.ProductPrice * itemCart.Quantity
            };

            db.CartItem.Add(addItem);
            TotalPriceCart(accountID);

            db.SaveChanges();

            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = m.Map<CartItemResponse>(variant),
                StatusCode = (int)HttpStatusCode.OK
            };
        }

        public ResponseMessage GetCartByAccuont(int userID)
        {
            var getCart = db.Account
                .Include(x => x.Cart).ThenInclude(x => x.CartItems).ThenInclude(x => x.Variant).ThenInclude(x => x.Product)
                .FirstOrDefault(x => x.AccountID == userID)!.Cart;

            if (getCart != null)
            {
                return new ResponseMessage
                {
                    Success = true,
                    Message = "Success",
                    Data = getCart.CartItems,
                    StatusCode = (int)HttpStatusCode.OK
                };
            }
            return new ResponseMessage
            {
                Success = false,
                Message = "Cart Not Found",
                Data = new int[0],
                StatusCode = (int)HttpStatusCode.NotFound
            };
        }

        public ResponseMessage DeleteCartItem(int userID, int variantID)
        {
            var getCart = db.Account.Include(x => x.Cart).FirstOrDefault(x => x.AccountID == userID)!.Cart;

            var checkDelete = db.CartItem
                                .Include(c => c.Cart)
                                .FirstOrDefault(x => x.VariantID == variantID && x.Cart.CartID == getCart.CartID);
            if (checkDelete != null)
            {
                db.CartItem.Remove(checkDelete);
                TotalPriceCart(userID);
                db.SaveChanges();

                return new ResponseMessage
                {
                    Success = true,
                    Message = "Success",
                    Data = checkDelete,
                    StatusCode = (int)HttpStatusCode.OK
                };
            }
            return new ResponseMessage
            {
                Success = false,
                Message = "Not Found",
                Data = new int[0],
                StatusCode = (int)HttpStatusCode.NotFound
            };
        }


        public ResponseMessage UpdateItem(UpdateCartItem cartItemDTO)
        {
            var getCart = db.Account.Include(x => x.Cart).FirstOrDefault(x => x.AccountID == cartItemDTO.UserID)!.Cart;

            var getCartITem = db.CartItem
                                .Include(x => x.Variant)
                                .ThenInclude(x => x.Product)
                                .FirstOrDefault(x => x.VariantID == cartItemDTO.VariantID && x.CartID == getCart.CartID);
            if (getCartITem.Quantity == cartItemDTO.Quantity)
            {
                return new ResponseMessage
                {
                    Success = true,
                    Message = "Success",
                    Data = getCartITem,
                    StatusCode = (int)HttpStatusCode.OK
                };
            }
            getCartITem.Quantity = cartItemDTO.Quantity;
            if (cartItemDTO.Quantity <= 0)
            {
                db.CartItem.Remove(getCartITem);
            }
            else
            {
                db.CartItem.Update(getCartITem);
                TotalItemPrice(getCartITem.VariantID);
            }
            TotalPriceCart(cartItemDTO.UserID);
            db.SaveChanges();

            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = getCartITem,
                StatusCode = (int)HttpStatusCode.OK
            };
        }

        public void TotalPriceCart(int accountID)
        {
            var getCart = db.Account.Include(x => x.Cart).FirstOrDefault(x => x.AccountID == accountID)?.Cart;
            if (getCart != null)
            {
                var getCartItem = db.CartItem.Include(x => x.Cart)
                                     .Where(x => x.CartID == getCart.CartID)
                                     .ToList();
                Decimal totalPrice = getCartItem.Sum(x => x.TotalItemPrice);
                getCart.TotalPrice = (decimal)totalPrice;
                db.Cart.Update(getCart);
            }
        }

        public void TotalItemPrice(int variantID)
        {
            var getCartItem = db.CartItem
                                .Include(x => x.Variant)
                                .ThenInclude(p => p.Product)
                                .FirstOrDefault(x => x.VariantID == variantID);
            getCartItem.TotalItemPrice = getCartItem.Variant.Product.ProductPrice * getCartItem.Quantity;
            db.CartItem.Update(getCartItem);
        }
    }
}

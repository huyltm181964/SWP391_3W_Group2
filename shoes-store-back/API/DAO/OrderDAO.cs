using API.Data;
using API.DTOs;
using API.DTOs.RequestDTO;
using API.DTOs.ResponseDTO;
using API.Models;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.DAO
{
    public class OrderDAO
    {
        private readonly ShoesDbContext db;
        private readonly CartDAO cartDao;
        private readonly IMapper m;
        public OrderDAO(ShoesDbContext db, CartDAO _cartDao, IMapper _m)
        {

            this.db = db;
            this.cartDao = _cartDao;
            this.m = _m;
        }

        public ResponseMessage CheckOut(CheckOutDTO checkoutDTO)
        {
            var getAccount = db.Account.Include(x => x.Cart).FirstOrDefault(x => x.AccountID == checkoutDTO.AccountID);

            Order addOrder = new Order
            {
                Account = getAccount,
                OrderAddress = checkoutDTO.OrderAddress,
                OrderDate = DateTime.Now,
                OrderStatus = "Ordered",
                TotalPrice = 0
            };
            db.Order.Add(addOrder);

            Decimal totalPrice = 0;
            foreach (var variantID in checkoutDTO.VariantID)
            {
                var getCartItem = db.CartItem
                                    .Include(v => v.Variant)
                                    .FirstOrDefault(x => x.VariantID == variantID && x.CartID == getAccount.CartID)!;
                var getVariant = db.ProductVariant.Include(x => x.Product).FirstOrDefault(x => x.VariantID == variantID)!;
                if (getVariant.VariantQuantity >= getCartItem.Quantity)
                {
                    OrderDetail addDetail = new OrderDetail
                    {
                        Order = addOrder,
                        Quantity = getCartItem.Quantity,
                        UnitPrice = getCartItem.Variant.Product.ProductPrice,
                        Variant = getVariant!,
                        VariantID = variantID
                    };

                    db.OrderDetail.Add(addDetail);
                    totalPrice += getCartItem.TotalItemPrice;
                    db.CartItem.Remove(getCartItem);

                    getVariant.VariantQuantity = getVariant.VariantQuantity - getCartItem.Quantity;
                    db.ProductVariant.Update(getVariant);
                }
                else
                {
                    return new ResponseMessage
                    {
                        Success = false,
                        Message =
                        getVariant.VariantQuantity <= 0
                        ? $"{getVariant.Product.ProductName} ({getVariant.VariantSize}/{getVariant.VariantColor}) is out of stock"
                        : $"{getVariant.Product.ProductName} ({getVariant.VariantSize}/{getVariant.VariantColor}) have quantity less than {getVariant.VariantQuantity + 1}",
                        Data = getVariant.Product.ProductName,
                        StatusCode = 400
                    };
                }
            }
            addOrder.TotalPrice = (decimal)totalPrice;

            CheckProductQuantity(checkoutDTO.VariantID);
            cartDao.TotalPriceCart(getAccount.AccountID);

            db.SaveChanges();
            return new ResponseMessage
            {
                Success = true,
                Data = m.Map<CheckOutReponse>(addOrder),
                Message = "Success",
                StatusCode = 200
            };
        }

        public ResponseMessage GetOrderByAccount(int accountID)
        {
            var getOrder = db.Order
                             .Include(x => x.Account)
                             .Include(x => x.OrderDetails).ThenInclude(x => x.Variant).ThenInclude(x => x.Product)
                             .Where(x => x.AccountID == accountID)
                             .ToList();
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = getOrder,
                StatusCode = 200
            };
        }

        public ResponseMessage GetAllOrder()
        {
            var listOder = db.Order
                             .Include(x => x.Account)
                             .ToList();
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = listOder,
                StatusCode = 200
            };
        }

        private void CheckProductQuantity(List<int> variantID)
        {
            foreach (int item in variantID)
            {
                var checkProduct = db.ProductVariant.Include(x => x.Product).ThenInclude(x => x.ProductVariants).FirstOrDefault(x => x.VariantID == item);
                if (checkProduct != null && checkProduct.Product.ProductVariants.Sum(x => x.VariantQuantity) == 0)
                {
                    checkProduct.Product.ProductStatus = "Out of stock";
                }
                else
                {
                    checkProduct.Product.ProductStatus = "Still in stock";
                }
                db.ProductVariant.Update(checkProduct);
            }
        }

        public ResponseMessage UpdateOrderStatus(int orderID)
        {
            var getOrder = db.Order
             .Include(x => x.Account)
             .FirstOrDefault(o => o.OrderID == orderID);
            if (getOrder != null && getOrder.OrderStatus.Equals("Ordered"))
            {
                getOrder.OrderStatus = "Completed";
                db.Order.Update(getOrder);
            }

            db.SaveChanges();
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = getOrder,
                StatusCode = 200
            };
        }

        public ResponseMessage CancelOrder(int orderID)
        {
            var getOrder = db.Order
                 .Include(x => x.Account)
                 .FirstOrDefault(o => o.OrderID == orderID);

            if (getOrder == null)
            {
                return new ResponseMessage
                {
                    Success = false,
                    Data = null,
                    Message = $"Order #{orderID} not found",
                    StatusCode = 400
                };
            }

            db.Order.Remove(getOrder);
            db.SaveChanges();

            return new ResponseMessage
            {
                Success = true,
                Data = null,
                Message = $"Cancel order #{orderID} successfully",
                StatusCode = 200
            };
        }

        public ResponseMessage GetPaymentURL(int orderID)
        {
            var order = db.Order.FirstOrDefault(x => x.OrderID == orderID);
            if (order == null)
            {
                return new ResponseMessage
                {
                    StatusCode = 404,
                    Data = null,
                    Success = false,
                    Message = "Order not found"
                };
            }

            var amount = order.TotalPrice * 20000;
            var addInfo = $"Pay%20for%20order%20%23{orderID}";
            return new ResponseMessage
            {
                StatusCode = 200,
                Data = $"https://img.vietqr.io/image/VCB-1018482628-compact.png?amount={amount}&addInfo={addInfo}&accountName=Nguyen%20Lu%20Nhat%20Huy",
                Success = true,
                Message = "Get PaymentURL successfully"
            };
        }
    }
}

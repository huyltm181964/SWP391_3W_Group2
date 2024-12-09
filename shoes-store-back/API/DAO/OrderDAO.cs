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
                OrderStatus = "Unpaid",
                PaymentDate = DateTime.Now,
                TotalPrice = 0
            };
            db.Order.Add(addOrder);

            Decimal totalPrice = 0;
            foreach (var variantID in checkoutDTO.VariantID)
            {
                var getCartItem = db.CartItem
                                    .Include(v => v.Variant)
                                    .FirstOrDefault(x => x.VariantID == variantID && x.CartID == getAccount.CartID)!;

                var getVariant = db.ProductVariant
                    .Include(x => x.Product)
                    .FirstOrDefault(x => x.VariantID == variantID)!;

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
            cartDao.TotalPriceCart(getAccount.AccountID);

            db.SaveChanges();
            return new ResponseMessage
            {
                Success = true,
                Data = m.Map<CheckOutReponse>(addOrder),
                Message = "Checkout successfully. Please go to history order to pay for it before we can delivery it to you.",
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

        /**
         * Lấy danh sách đơn hàng theo trạng thái.
         * @param orderStatus: Trạng thái đơn hàng cần lọc.
         * @return ResponseMessage: Kết quả chứa danh sách đơn hàng.
         */
        public ResponseMessage GetOrderByStatus(string orderStatus)
        {
            // Lấy danh sách đơn hàng theo trạng thái, bao gồm thông tin tài khoản, chi tiết và sản phẩm.
            var listOder = db.Order
                             .Include(x => x.Account)
                             .Where(x => x.OrderStatus == orderStatus)
                             .Include(x => x.OrderDetails).ThenInclude(x => x.Variant).ThenInclude(x => x.Product)
                             .ToList();

            // Trả về kết quả thành công với danh sách đơn hàng.
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = listOder,
                StatusCode = 200
            };
        }

        /**
         * Cập nhật trạng thái đơn hàng và gửi thông báo.
         * @param orderID: ID của đơn hàng cần cập nhật.
         * @param orderStatus: Trạng thái mới của đơn hàng.
         * @return ResponseMessage: Kết quả xử lý.
         */
        public ResponseMessage UpdateOrderStatus(int orderID, string orderStatus)
        {
            // Tìm đơn hàng theo ID.
            var getOrder = db.Order
                             .Include(x => x.Account)
                             .FirstOrDefault(o => o.OrderID == orderID);

            // Nếu không tìm thấy, trả về lỗi.
            if (getOrder == null)
            {
                return new ResponseMessage
                {
                    Success = false,
                    Data = null,
                    Message = $"Order #{orderID} not found",
                    StatusCode = 404
                };
            }

            // Cập nhật trạng thái đơn hàng.
            getOrder.OrderStatus = orderStatus;
            db.Order.Update(getOrder);

            // Tạo thông báo cho tài khoản liên quan.
            var notification = new Notification()
            {
                AccountID = getOrder.AccountID,
                Title = $"Order #{getOrder.OrderID} status",
                Description = $"Your order #{getOrder.OrderID} is now {orderStatus.ToLower()}"
            };
            db.Notification.Add(notification);

            // Lưu thay đổi vào database.
            db.SaveChanges();

            // Trả về kết quả thành công.
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
                    StatusCode = 404
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
                Data = $"https://img.vietqr.io/image/VCB-0091000684276-compact.png?amount={amount}&addInfo={addInfo}&accountName=Lam%20Tran%20Minh%20Huy",
                Success = true,
                Message = "Get PaymentURL successfully"
            };
        }
    }
}

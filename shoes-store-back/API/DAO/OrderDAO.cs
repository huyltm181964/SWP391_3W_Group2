using API.Data;
using API.DTOs;
using API.DTOs.RequestDTO;
using API.DTOs.ResponseDTO;
using API.Models;
using API.Utils;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Net;

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
                AccountID = getAccount.AccountID,
                OrderAddress = checkoutDTO.OrderAddress,
                OrderDate = DateTime.Now,
                OrderStatus = "Unpaid",
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
                Data = db.Order.OrderBy(x => x.OrderID).LastOrDefault(),
                Message = "Checkout successfully. Please wait to get payment.",
                StatusCode = 200
            };
        }

        public ResponseMessage GetOrderByAccount(int accountID)
        {
            var getOrder = db.Order
                             .Include(x => x.Account)
                             .Include(x => x.OrderDetails).ThenInclude(x => x.Variant).ThenInclude(x => x.Product)
                             .Where(x => x.AccountID == accountID)
                             .OrderByDescending(x => x.OrderID)
                             .ToList();
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = getOrder,
                StatusCode = 200
            };
        }

        //Lấy danh sách order bằng status kiểu như("Delivery", "Ordered")
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

        public ResponseMessage GetAllOrder()
        {
            var listOder = db.Order
                             .Include(x => x.Account)
                             .Include(x => x.OrderDetails).ThenInclude(x => x.Variant).ThenInclude(x => x.Product)
                             .ToList();

            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = listOder,
                StatusCode = 200
            };
        }

        //Cập nhật order status tùy vào method nào vd: của user là Unpaid => Ordered, của staff là Ordered => Delivery, của admin là Delivery => Deliveried
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

            // Cập nhật Order status
            getOrder.OrderStatus = orderStatus;
            db.Order.Update(getOrder);

            // Tạo thông báo cho tài khoản đã order product cho người ta biết tiến trình đơn hàng của họ.
            var notification = new Notification()
            {
                AccountID = getOrder.AccountID,
                Title = $"Order #{getOrder.OrderID} status",
                Description = $"Your order #{getOrder.OrderID} is now {orderStatus.ToLower()}"
            };
            db.Notification.Add(notification);

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

        public ResponseMessage GetPaymentURL(int orderID, IPAddress ipAddress, IConfiguration configuration)
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

            order.PaymentDate = DateTime.Now;
            db.Order.Update(order);
            db.SaveChanges();

#pragma warning disable
            var vnp = new VNPay();
            vnp.AddRequestData("vnp_Version", configuration["VNPayConfig:vnp_Version"]);
            vnp.AddRequestData("vnp_Command", configuration["VNPayConfig:vnp_Command"]);
            vnp.AddRequestData("vnp_TmnCode", configuration["VNPayConfig:vnp_TmnCode"]);
            vnp.AddRequestData("vnp_Amount", ((long)(order.TotalPrice * 20000 * 100)).ToString());
            vnp.AddRequestData("vnp_CreateDate", order.PaymentDate.ToString("yyyyMMddHHmmss"));
            vnp.AddRequestData("vnp_CurrCode", configuration["VNPayConfig:vnp_CurrCode"]);
            vnp.AddRequestData("vnp_IpAddr", "127.0.0.1");
            vnp.AddRequestData("vnp_Locale", configuration["VNPayConfig:vnp_Locale"]);
            vnp.AddRequestData("vnp_OrderInfo", $"Thanh toan hoa don #{order.OrderID}");
            vnp.AddRequestData("vnp_OrderType", configuration["VNPayConfig:vnp_OrderType"]);
            vnp.AddRequestData("vnp_ReturnUrl", configuration["VNPayConfig:vnp_ReturnUrl"]);
            vnp.AddRequestData("vnp_ExpireDate", order.PaymentDate.AddMinutes(30).ToString("yyyyMMddHHmmss"));
            vnp.AddRequestData("vnp_TxnRef", order.PaymentDate.Ticks.ToString());

            var paymentURL = vnp.CreateRequestUrl(configuration["VNPayConfig:vnp_BaseUrl"], configuration["VNPayConfig:vnp_HashSecret"]);
#pragma warning enable
        
            return new ResponseMessage
            {
                StatusCode = 200,
                Data = paymentURL,
                Success = true,
                Message = "Get PaymentURL successfully"
            };
        }

        public ResponseMessage VerifyOrder(int orderID)
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

            UpdateOrderStatus(orderID, "Ordered");
            var staffs = db.Account.Where(a => a.Role == "Staff");
            foreach (var staff in staffs)
            {
                var notification = new Notification
                {
                    AccountID = staff.AccountID,
                    Title = "New order need to be exported",
                    Description = $"Order #{orderID} has been paid and is waiting to be export."
                };

                db.Notification.Add(notification);
            }
            db.SaveChanges();

            return new ResponseMessage
            {
                Success = true,
                Data = null,
                Message = "Verify successfully",
                StatusCode = 200
            };
        }
    }
}

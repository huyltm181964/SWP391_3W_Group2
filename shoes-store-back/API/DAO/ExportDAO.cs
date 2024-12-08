
using API.Data;
using API.DTOs.ResponseDTO;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.DAO
{
    public class ExportDAO
    {
        private readonly ShoesDbContext db;
        public ExportDAO(ShoesDbContext db)
        {
            this.db = db;
        }

        public ResponseMessage ExportAllOrderDetailInOrder(int orderID)
        {
            var order = db.Order
                .Include(o => o.OrderDetails)
                .FirstOrDefault(o => o.OrderID == orderID);
            if (order == null)
            {
                return new ResponseMessage()
                {
                    Data = null,
                    Message = "Order not found",
                    StatusCode = 404,
                    Success = false,
                };
            }

            var unexportedOrderDetail = order.OrderDetails.Where(od => !od.IsExported).ToList();
            foreach (var orderDetail in unexportedOrderDetail)
            {
                orderDetail.IsExported = true;

                var export = new Export
                {
                    VariantID = orderDetail.VariantID,
                    ExportDate = DateTime.Now,
                    ExportLocation = order.OrderAddress,
                    Quantity = orderDetail.Quantity
                };
                db.Export.Add(export);

                var variant = db.ProductVariant.Include(v => v.Product).FirstOrDefault(v => v.VariantID == orderDetail.VariantID);
                if (variant.VariantQuantity < orderDetail.Quantity)
                {
                    return new ResponseMessage()
                    {
                        Data = null,
                        Message = variant.VariantQuantity <= 0
                        ? $"{variant.Product?.ProductName} ({variant.VariantSize}/{variant.VariantColor}) is out of stock"
                        : $"{variant.Product?.ProductName} ({variant.VariantSize}/{variant.VariantColor}) only have {variant.VariantQuantity} in stock, can't export",
                        StatusCode = 400,
                        Success = false,
                    };
                }
                variant.VariantQuantity -= orderDetail.Quantity;
                db.ProductVariant.Update(variant);

                if (variant.VariantQuantity <= 5)
                {
                    var staffs = db.Account.Where(a => a.Role == "Staff");
                    foreach (var staff in staffs)
                    {
                        var notification = new Notification
                        {
                            AccountID = staff.AccountID,
                            Title = $"Variant #{variant.VariantID}'s stock",
                            Description = $"Variant #{variant.VariantID} is nearly out of stock (Current: {variant.VariantQuantity}). Need to be refilled as soon as possible",
                        };

                        db.Notification.Add(notification);
                    }
                }
            }
            db.OrderDetail.UpdateRange(unexportedOrderDetail);

            db.SaveChanges();

            return new ResponseMessage()
            {
                Data = null,
                Message = "Export all successfully",
                StatusCode = 200,
                Success = true,
            };
        }

        public ResponseMessage ExportOrderDetail(int orderID, int variantID)
        {
            var order = db.Order
                .Include(o => o.OrderDetails)
                .FirstOrDefault(o => o.OrderID == orderID);
            if (order == null)
            {
                return new ResponseMessage()
                {
                    Data = null,
                    Message = "Order not found",
                    StatusCode = 404,
                    Success = false,
                };
            }

            var variant = db.ProductVariant.Include(v => v.Product).FirstOrDefault(v => v.VariantID == variantID);
            if (variant == null)
            {
                return new ResponseMessage()
                {
                    Data = null,
                    Message = "Variant not found",
                    StatusCode = 404,
                    Success = false,
                };
            }

            var orderDetail = order.OrderDetails.FirstOrDefault(od => od.VariantID == variant.VariantID);
            if (orderDetail == null)
            {
                return new ResponseMessage()
                {
                    Data = null,
                    Message = "Order detail not found",
                    StatusCode = 404,
                    Success = false,
                };
            }

            orderDetail.IsExported = true;
            db.OrderDetail.Update(orderDetail);

            if (variant.VariantQuantity < orderDetail.Quantity)
            {
                return new ResponseMessage()
                {
                    Data = null,
                    Message = variant.VariantQuantity <= 0
                    ? $"{variant.Product?.ProductName} ({variant.VariantSize}/{variant.VariantColor}) is out of stock"
                    : $"{variant.Product?.ProductName} ({variant.VariantSize}/{variant.VariantColor}) only have {variant.VariantQuantity} in stock, can't export",
                    StatusCode = 400,
                    Success = false,
                };
            }
            variant.VariantQuantity -= orderDetail.Quantity;
            db.ProductVariant.Update(variant);

            var export = new Export
            {
                VariantID = orderDetail.VariantID,
                ExportDate = DateTime.Now,
                ExportLocation = order.OrderAddress,
                Quantity = orderDetail.Quantity
            };
            db.Export.Add(export);

            if (variant.VariantQuantity <= 5)
            {
                var staffs = db.Account.Where(a => a.Role == "Staff");
                foreach (var staff in staffs)
                {
                    var notification = new Notification
                    {
                        AccountID = staff.AccountID,
                        Title = $"Variant #{variant.VariantID}'s stock",
                        Description = $"Variant #{variant.VariantID} is nearly out of stock (Current: {variant.VariantQuantity}). Need to be refilled as soon as possible",
                    };

                    db.Notification.Add(notification);
                }
            }

            db.SaveChanges();

            return new ResponseMessage()
            {
                Data = order.OrderDetails.All(od => od.IsExported) ? "Delivery" : null,
                Message = "Export successfully",
                StatusCode = 200,
                Success = true,
            };
        }
    }
}

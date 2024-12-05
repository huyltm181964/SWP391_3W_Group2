
using API.Data;
using API.DTOs.ResponseDTO;
using API.Models;

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
            var order = db.Order.FirstOrDefault(o => o.OrderID == orderID);
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
            foreach (var orderDetail in unexportedOrderDetail) {
                orderDetail.IsExported = true;

                var export = new Export
                {
                    VariantID = orderDetail.VariantID,
                    ExportDate = DateTime.Now,
                    ExportLocation = order.OrderAddress,
                    Quantity = orderDetail.Quantity
                };
                db.Export.Add(export);
            }
            db.OrderDetail.UpdateRange(unexportedOrderDetail);

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
            var order = db.Order.FirstOrDefault(o => o.OrderID == orderID);
            if (order == null) {
                return new ResponseMessage()
                {
                    Data = null,
                    Message = "Order not found",
                    StatusCode = 404,
                    Success = false,
                };
            }

            var variant = db.ProductVariant.FirstOrDefault(v => v.VariantID == variantID);
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
            if (orderDetail == null) {
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

            var export = new Export
            {
                VariantID = orderDetail.VariantID,
                ExportDate = DateTime.Now,
                ExportLocation = order.OrderAddress,
                Quantity = orderDetail.Quantity
            };
            db.Export.Add(export);

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

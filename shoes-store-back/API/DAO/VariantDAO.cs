
using API.Data;
using API.DTOs.RequestDTO;
using API.DTOs.ResponseDTO;
using API.Models;
using API.Utils.Ultils;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MimeKit.Cryptography;
using System.Linq.Expressions;
using System.Net;

namespace API.DAO
{
    public class VariantDAO
    {
        private readonly ShoesDbContext db;
        private readonly IWebHostEnvironment env;
        private readonly IMapper m;
        private readonly ProductDAO dao;
        public VariantDAO(ShoesDbContext _db, IWebHostEnvironment _env, IMapper _m, ProductDAO dao)
        {
            this.db = _db;
            this.env = _env;
            this.m = _m;
            this.dao = dao;
        }

        /**
         * Thêm biến thể sản phẩm.
         * @param createVariant: Dữ liệu thông tin biến thể cần thêm.
         * @return ResponseMessage: Kết quả thêm mới (thành công hoặc lỗi).
         */
        public ResponseMessage CreateVariant(CreateVariantDTO createVariant)
        {
            var getProduct = db.Product.FirstOrDefault(x => x.ProductID == createVariant.ProductID);
            if (getProduct == null)
            {
                return new ResponseMessage // Trả về nếu không tìm thấy sản phẩm
                {
                    Success = false,
                    Message = "Product not found",
                    Data = null,
                    StatusCode = 404
                };
            }

            var isExistedVariant =
                db.ProductVariant.Any(x => x.VariantSize == createVariant.VariantSize
                && x.ProductID == getProduct.ProductID
                && x.VariantColor == createVariant.VariantColor);

            if (isExistedVariant)
            {
                return new ResponseMessage // Trả về nếu biến thể đã tồn tại
                {
                    Success = false,
                    Message = "Variant already existed",
                    Data = null,
                    StatusCode = 409
                };
            }

            var image = Ultils.SaveImage(createVariant.VariantImage!, env); // Lưu hình ảnh biến thể
            ProductVariant addVariant = new ProductVariant
            {
                Product = getProduct,
                VariantColor = createVariant.VariantColor!,
                VariantSize = createVariant.VariantSize!,
                VariantImg = image
            };

            db.ProductVariant.Add(addVariant); // Thêm biến thể mới vào cơ sở dữ liệu
            db.SaveChanges(); // Lưu thay đổi

            return new ResponseMessage // Trả về kết quả thành công
            {
                Success = true,
                Message = "Success",
                Data = null,
                StatusCode = 200
            };
        }

        public ResponseMessage GetAll()
        {
            var getVariant = db.ProductVariant.ToList();
            if (getVariant != null)
            {
                return new ResponseMessage
                {
                    Success = true,
                    Message = "Success",
                    Data = getVariant,
                    StatusCode = 200
                };
            }
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = new int[0],
                StatusCode = 200
            };
        }

        /**
          * Cập nhật thông tin biến thể sản phẩm.
          * @param updateVariantDTO: Dữ liệu thông tin biến thể cần cập nhật.
          * @return ResponseMessage: Kết quả cập nhật (thành công hoặc lỗi).
          */
        public ResponseMessage UpdateVariant(UpdateVariantDTO updateVariantDTO)
        {
            var getVariant = db.ProductVariant.Include(x => x.Product)
                                              .FirstOrDefault(x => x.VariantID == updateVariantDTO.VariantID);
            if (getVariant == null)
            {
                return new ResponseMessage // Trả về nếu không tìm thấy biến thể
                {
                    Success = false,
                    Message = "Variant Not Found",
                    Data = new int[0],
                    StatusCode = 404
                };
            }

            var image = Ultils.SaveImage(updateVariantDTO.VariantImage!, env); // Lưu hình ảnh mới
            getVariant.VariantColor = updateVariantDTO.VariantColor ?? getVariant.VariantColor!;
            getVariant.VariantSize = updateVariantDTO.VariantSize ?? getVariant.VariantSize!;
            getVariant.VariantImg = image ?? getVariant.VariantImg;

            db.ProductVariant.Update(getVariant); // Cập nhật biến thể trong cơ sở dữ liệu
            db.SaveChanges(); // Lưu thay đổi

            return new ResponseMessage // Trả về kết quả thành công
            {
                Success = true,
                Message = "Success",
                Data = null,
                StatusCode = 200
            };
        }

        /**
         * Dừng hoặc tiếp tục bán biến thể sản phẩm.
         * @param variantID: ID của biến thể cần cập nhật.
         * @return ResponseMessage: Kết quả cập nhật trạng thái (thành công hoặc lỗi).
         */
        public ResponseMessage DeleteVariant(int variantID)
        {
            var checkDelete = db.ProductVariant
                .Include(x => x.Product).ThenInclude(x => x.ProductVariants)
                .FirstOrDefault(x => x.VariantID == variantID);
            if (checkDelete != null)
            {
                // Đổi trạng thái dừng bán hoặc tiếp tục bán
                checkDelete.IsStopSelling = !checkDelete.IsStopSelling;

                db.ProductVariant.Update(checkDelete); // Cập nhật trạng thái
                db.SaveChanges(); // Lưu thay đổi

                return new ResponseMessage
                {
                    Success = true,
                    Message = "Success",
                    Data = checkDelete,
                    StatusCode = 200
                };
            }

            return new ResponseMessage // Trả về nếu không tìm thấy biến thể
            {
                Success = false,
                Message = "Variant Not Found",
                Data = null,
                StatusCode = 404
            };
        }
    }
}

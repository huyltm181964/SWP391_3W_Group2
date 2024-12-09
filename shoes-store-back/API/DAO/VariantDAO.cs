
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

        //Tạo 1 variant cuar product lào đó
        public ResponseMessage CreateVariant(CreateVariantDTO createVariant)
        {
            //Lấy product bằng id nè
            var getProduct = db.Product.FirstOrDefault(x => x.ProductID == createVariant.ProductID);
            if (getProduct == null)
            {
                //Bị lấy ko ra product nên not found nè
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Product not found",
                    Data = null,
                    StatusCode = 404
                };
            }

            //Kiểm tra coi variant trong product đó có tồn tại cái nào ko nè, ko cho nó trùng đc
            var isExistedVariant =
                db.ProductVariant.Any(x => x.VariantSize == createVariant.VariantSize
                && x.ProductID == getProduct.ProductID
                && x.VariantColor == createVariant.VariantColor);

            if (isExistedVariant)
            {
                //Trùng rồi thì cho nó về 409 nè
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Variant already existed",
                    Data = null,
                    StatusCode = 409
                };
            }

            var image = Ultils.SaveImage(createVariant.VariantImage!, env); // Lưu hình ảnh của variant nè
            ProductVariant addVariant = new ProductVariant
            {
                Product = getProduct,
                VariantColor = createVariant.VariantColor!,
                VariantSize = createVariant.VariantSize!,
                VariantImg = image
            };

            db.ProductVariant.Add(addVariant);
            db.SaveChanges();

            //Sau khi add thì là thành công nè
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = null,
                StatusCode = 200
            };
        }

        //Lấy list variant nè
        public ResponseMessage GetAll()
        {
            //Đơn giản là lấy list variant thoi
            var getVariant = db.ProductVariant.ToList();
            if (getVariant != null)
            {
                //Trường hợp ko rỗng thì mình sẽ trả về list
                return new ResponseMessage
                {
                    Success = true,
                    Message = "Success",
                    Data = getVariant,
                    StatusCode = 200
                };
            }
            //Còn nếu thì mình trả về empty array
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = new int[0],
                StatusCode = 200
            };
        }

        //Doc ten ham
        public ResponseMessage UpdateVariant(UpdateVariantDTO updateVariantDTO)
        {
            //Lấy variant by id
            var getVariant = db.ProductVariant.Include(x => x.Product)
                                              .FirstOrDefault(x => x.VariantID == updateVariantDTO.VariantID);
            if (getVariant == null)
            {
                //variant bị rỗng => not found
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Variant Not Found",
                    Data = new int[0],
                    StatusCode = 404
                };
            }

            var image = Ultils.SaveImage(updateVariantDTO.VariantImage!, env); // Lưu hình ảnh 
            getVariant.VariantColor = updateVariantDTO.VariantColor ?? getVariant.VariantColor!;
            getVariant.VariantSize = updateVariantDTO.VariantSize ?? getVariant.VariantSize!;
            getVariant.VariantImg = image ?? getVariant.VariantImg;

            db.ProductVariant.Update(getVariant);
            db.SaveChanges();

            // Trả về kết quả thành công
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = null,
                StatusCode = 200
            };
        }

       //Xóa variant nhưng mà là xóa mềm
        public ResponseMessage DeleteVariant(int variantID)
        {
            //Lấy cái variant by id
            var checkDelete = db.ProductVariant
                .Include(x => x.Product).ThenInclude(x => x.ProductVariants)
                .FirstOrDefault(x => x.VariantID == variantID);
            if (checkDelete != null)
            {
                // Đổi trạng thái sang dừng bán
                checkDelete.IsStopSelling = true;

                db.ProductVariant.Update(checkDelete); 
                db.SaveChanges(); 

                return new ResponseMessage
                {
                    Success = true,
                    Message = "Success",
                    Data = checkDelete,
                    StatusCode = 200
                };
            }

            //variant bị rỗng => not found
            return new ResponseMessage 
            {
                Success = false,
                Message = "Variant Not Found",
                Data = null,
                StatusCode = 404
            };
        }
    }
}

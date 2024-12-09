using API.Data;
using API.DTOs.RequestDTO;
using API.DTOs.ResponseDTO;
using API.Models;
using API.Utils.Ultils;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace API.DAO
{
    public class ProductDAO
    {
        private readonly ShoesDbContext db;
        private readonly IMapper m;
        private readonly IWebHostEnvironment env;
        public ProductDAO(ShoesDbContext _db, IMapper mapper, IWebHostEnvironment env)
        {
            this.db = _db;
            this.m = mapper;
            this.env = env;
        }

        //Lấy cái list product thôi
        public ResponseMessage GetProducts()
        {
            // Lấy danh sách sản phẩm, bao gồm thông tin bình luận.
            var listProduct = db.Product.Include(x => x.Comments).ToList();

            // Trả về kết quả thành công
            return new ResponseMessage
            {
                Success = true,
                StatusCode = (int)HttpStatusCode.OK,
                Message = "Success",
                Data = listProduct,
            };
        }


        //Xóa product nhưng mà xóa mềm(Thật ra chỉ là update status thoi)
        public ResponseMessage DeleteProduct(int productID)
        {
            // Tìm sản phẩm theo ID.
            var getProduct = db.Product.FirstOrDefault(x => x.ProductID == productID);
            if (getProduct != null)
            {
                //Chuyển status 
                getProduct.ProductStatus = "Out of business";

                // Cập nhật thay đổi 
                db.Product.Update(getProduct);
                db.SaveChanges();

                // Trả về kết quả thành công.
                return new ResponseMessage
                {
                    Success = true,
                    Message = "Success",
                    Data = null,
                    StatusCode = (int)HttpStatusCode.OK
                };
            }
            // Trả về lỗi nếu không tìm thấy sản phẩm.
            return new ResponseMessage
            {
                Success = false,
                Message = "Product Not Found",
                Data = null,
                StatusCode = (int)HttpStatusCode.NotFound
            };
        }

        public ResponseMessage SearchProduct(String productName)
        {
            var getProduct = db.Product.Where(x => x.ProductName.Contains(productName)).ToList();
            if (getProduct != null)
            {
                return new ResponseMessage
                {
                    Success = true,
                    Message = "Success",
                    Data = getProduct,
                    StatusCode = (int)HttpStatusCode.OK,
                };
            }

            return new ResponseMessage
            {
                Success = false,
                Message = "Data not found",
                Data = new int[0],
                StatusCode = (int)HttpStatusCode.NotFound,
            };
        }

        // doc ten ham cung du hieu
        public ResponseMessage AddProduct(AddProductDTO addProductDTO)
        {
            if (addProductDTO == null)
            {
            // Nếu rỗng => lỗi
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Bad Request",
                    Data = addProductDTO,
                    StatusCode = (int)HttpStatusCode.BadRequest
                };
            }

            // Lưu hình ảnh product và lấy đường dẫn.
            var imageUrl = Ultils.SaveImage(addProductDTO.ProductImg, env);

           //Tạo product mới
            Product addProduct = new Product
            {
                ProductName = addProductDTO.ProductName,
                ProductCategory = addProductDTO.ProductCategory,
                ProductPrice = addProductDTO.ProductPrice,
                ProductDescription = addProductDTO.ProductDescription,
                ProductStatus = addProductDTO.ProductStatus,
                ProductImg = imageUrl
            };

            db.Product.Add(addProduct);
            db.SaveChanges();

            // Trả về kết quả thành công.
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = null,
                StatusCode = (int)HttpStatusCode.OK,
            };
        }

        public ResponseMessage UpdateProduct(UpdateProductDTO updateProductDTO)
        {
            // Tìm sản phẩm cần cập nhật thông qua ID.
            var getProduct = db.Product.FirstOrDefault(x => x.ProductID == updateProductDTO.ProductID);
            if (getProduct == null)
            {   
                //Nếu rỗng => lỗi
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Data not found",
                    Data = new int[0],
                    StatusCode = (int)HttpStatusCode.NotFound
                };
            }

            // Cập nhật thông tin sản phẩm, bao gồm cả ảnh 
            getProduct.ProductImg = updateProductDTO.ProductImg != null ? Ultils.SaveImage(updateProductDTO.ProductImg, env) : getProduct.ProductImg;
            getProduct.ProductName = updateProductDTO.ProductName ?? getProduct.ProductName;
            getProduct.ProductPrice = updateProductDTO.ProductPrice != 0 ? updateProductDTO.ProductPrice : getProduct.ProductPrice;
            getProduct.ProductDescription = updateProductDTO.ProductDescription ?? getProduct.ProductDescription;
            getProduct.ProductStatus = getProduct.ProductStatus;
            getProduct.ProductCategory = updateProductDTO.ProductCategory ?? getProduct.ProductCategory;

            // Lưu các thay đổi vào cơ sở dữ liệu.
            db.Product.Update(getProduct);
            db.SaveChanges();

            // Trả về kết quả thành công.
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = null,
                StatusCode = (int)HttpStatusCode.OK
            };
        }

        //Lấy 1 product cụ thể
        public ResponseMessage GetDetail(int productId)
        {
            // Lấy 1 product cụ thể
            var product = db.Product
                .Include(x => x.ProductVariants)
                .Include(x => x.Comments).ThenInclude(x => x.Account)
                .FirstOrDefault(x => x.ProductID == productId);

            // Trả về thành công
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = product,
                StatusCode = (int)HttpStatusCode.OK,
            };
        }
    }
}

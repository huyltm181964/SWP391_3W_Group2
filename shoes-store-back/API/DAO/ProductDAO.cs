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

        /**
         * Lấy danh sách sản phẩm và các bình luận liên quan.
         * @return ResponseMessage: Kết quả chứa danh sách sản phẩm.
         */
        public ResponseMessage GetProducts()
        {
            // Lấy danh sách sản phẩm, bao gồm thông tin bình luận.
            var listProduct = db.Product.Include(x => x.Comments).ToList();

            // Trả về kết quả thành công với danh sách sản phẩm.
            return new ResponseMessage
            {
                Success = true,
                StatusCode = (int)HttpStatusCode.OK,
                Message = "Success",
                Data = listProduct,
            };
        }


        /**
         * Thay đổi trạng thái kinh doanh của sản phẩm hoặc báo lỗi nếu không tìm thấy sản phẩm.
         * @param productID: ID của sản phẩm cần xóa hoặc thay đổi trạng thái.
         * @return ResponseMessage: Kết quả xử lý.
         */
        public ResponseMessage DeleteProduct(int productID)
        {
            // Tìm sản phẩm theo ID.
            var getProduct = db.Product.FirstOrDefault(x => x.ProductID == productID);
            if (getProduct != null)
            {
                // Thay đổi trạng thái sản phẩm giữa "Out of business" và "In business".
                if (getProduct.ProductStatus.Equals("Out of business"))
                {
                    getProduct.ProductStatus = "In business";
                }
                else
                {
                    getProduct.ProductStatus = "Out of business";
                }

                // Cập nhật thay đổi trong cơ sở dữ liệu.
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

        /**
         * Thêm một sản phẩm mới vào cơ sở dữ liệu.
         * @param Product: Thông tin sản phẩm cần thêm (AddProductDTO).
         * @return ResponseMessage: Kết quả xử lý.
         */
        public ResponseMessage AddProduct(AddProductDTO addProductDTO)
        {
            // Kiểm tra dữ liệu sản phẩm đầu vào.
            if (addProductDTO == null)
            {
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Bad Request",  // Dữ liệu không hợp lệ.
                    Data = addProductDTO,
                    StatusCode = (int)HttpStatusCode.BadRequest
                };
            }

            // Lưu hình ảnh sản phẩm và lấy đường dẫn.
            var imageUrl = Ultils.SaveImage(addProductDTO.ProductImg, env);

            // Tạo đối tượng sản phẩm mới từ dữ liệu đầu vào.
            Product addProduct = new Product
            {
                ProductName = addProductDTO.ProductName,
                ProductCategory = addProductDTO.ProductCategory,
                ProductPrice = addProductDTO.ProductPrice,
                ProductDescription = addProductDTO.ProductDescription,
                ProductStatus = addProductDTO.ProductStatus,
                ProductImg = imageUrl
            };

            // Thêm sản phẩm vào cơ sở dữ liệu và lưu thay đổi.
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

        /**
         * Cập nhật thông tin sản phẩm trong cơ sở dữ liệu.
         * @param updateProductDTO: Dữ liệu cập nhật sản phẩm (UpdateProductDTO).
         * @return ResponseMessage: Kết quả xử lý.
         */
        public ResponseMessage UpdateProduct(UpdateProductDTO updateProductDTO)
        {
            // Tìm sản phẩm cần cập nhật thông qua ID.
            var getProduct = db.Product.FirstOrDefault(x => x.ProductID == updateProductDTO.ProductID);
            if (getProduct == null)
            {
                // Trả về lỗi nếu không tìm thấy sản phẩm.
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Data not found",
                    Data = new int[0],
                    StatusCode = (int)HttpStatusCode.NotFound
                };
            }

            // Cập nhật thông tin sản phẩm, bao gồm ảnh nếu có.
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

        /**
         * Lấy thông tin chi tiết sản phẩm, bao gồm các biến thể và bình luận liên quan.
         * @return ResponseMessage: Thông tin chi tiết của sản phẩm.
         * @param productId: ID của sản phẩm.
         */
        public ResponseMessage GetDetail(int productId)
        {
            // Lấy sản phẩm và các thông tin liên quan như biến thể và bình luận.
            var product = db.Product
                .Include(x => x.ProductVariants)
                .Include(x => x.Comments).ThenInclude(x => x.Account)
                .FirstOrDefault(x => x.ProductID == productId);

            // Trả về kết quả thành công với dữ liệu chi tiết sản phẩm.
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

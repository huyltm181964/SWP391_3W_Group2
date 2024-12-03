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

        public ResponseMessage GetProducts()
        {
            var listProduct = db.Product.Include(x => x.Comments).ToList();
            return new ResponseMessage
            {
                Success = true,
                StatusCode = (int)HttpStatusCode.OK,
                Message = "Success",
                Data = listProduct,
            };
        }

        public ResponseMessage DeleteProduct(int productID)
        {
            var getProduct = db.Product.FirstOrDefault(x => x.ProductID == productID);
            if (getProduct != null)
            {
                getProduct.ProductStatus = "Out of business";
                db.Product.Update(getProduct);
                db.SaveChanges();
                return new ResponseMessage
                {
                    Success = true,
                    Message = "Success",
                    Data = m.Map<ProductResponseDTO>(getProduct),
                    StatusCode = (int)HttpStatusCode.OK
                };
            }
            return new ResponseMessage
            {
                Success = false,
                Message = "Product Not Found",
                Data = m.Map<ProductResponseDTO>(getProduct),
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
                    Data = m.Map<List<ProductResponseDTO>>(getProduct),
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

        public ResponseMessage AddProduct(AddProductDTO Product)
        {
            if (Product == null)
            {
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Bad Request",
                    Data = Product,
                    StatusCode = (int)HttpStatusCode.BadRequest
                };
            }
            var imageUrl = Ultils.SaveImage(Product.ProductImg, env);
            Product addProduct = new Product
            {
                ProductName = Product.ProductName,
                ProductCategory = Product.ProductCategory,
                ProductPrice = Product.ProductPrice,
                ProductDescription = Product.ProductDescription,
                ProductStatus = Product.ProductStatus,
                ProductImg = imageUrl
            };
            db.Product.Add(addProduct);
            db.SaveChanges();
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = m.Map<ProductResponseDTO>(addProduct),
                StatusCode = (int)HttpStatusCode.OK,
            };
        }

        public ResponseMessage UpdateProduct(UpdateProductDTO updateProductDTO)
        {
            var getProduct = db.Product.FirstOrDefault(x => x.ProductID == updateProductDTO.ProductID);
            if (getProduct == null)
            {
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Data not found",
                    Data = new int[0],
                    StatusCode = (int)HttpStatusCode.NotFound
                };
            }

            getProduct.ProductImg = updateProductDTO.ProductImg != null ? Ultils.SaveImage(updateProductDTO.ProductImg, env) : getProduct.ProductImg;
            getProduct.ProductName = updateProductDTO.ProductName ?? getProduct.ProductName;
            getProduct.ProductPrice = updateProductDTO.ProductPrice != 0 ? updateProductDTO.ProductPrice : getProduct.ProductPrice;
            getProduct.ProductDescription = updateProductDTO.ProductDescription ?? getProduct.ProductDescription;
            getProduct.ProductStatus = getProduct.ProductStatus;
            getProduct.ProductCategory = updateProductDTO.ProductCategory ?? getProduct.ProductCategory;
            db.Product.Update(getProduct);
            db.SaveChanges();
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = m.Map<ProductResponseDTO>(getProduct),
                StatusCode = (int)HttpStatusCode.OK
            };
        }

        public ResponseMessage GetDetail(int productId)
        {
            var product = db.Product
                .Include(x => x.ProductVariants)
                .Include(x => x.Comments).ThenInclude(x => x.Account)
                .FirstOrDefault(x => x.ProductID == productId);

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

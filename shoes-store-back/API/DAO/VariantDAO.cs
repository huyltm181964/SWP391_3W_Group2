
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


        public ResponseMessage CreateVariant(CreateVariantDTO createVariant)
        {

            var getProduct = db.Product.FirstOrDefault(x => x.ProductID == createVariant.ProductID);
            if (getProduct == null)
            {
                return new ResponseMessage
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
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Variant already existed",
                    Data = null,
                    StatusCode = 409
                };
            }

            var image = Ultils.SaveImage(createVariant.VariantImage!, env);
            ProductVariant addVariant = new ProductVariant
            {
                Product = getProduct,
                VariantColor = createVariant.VariantColor!,
                VariantSize = createVariant.VariantSize!,
                VariantImg = image
            };

            db.ProductVariant.Add(addVariant);

            db.SaveChanges();
            return new ResponseMessage
            {
                Success = true,
                Message = "Sucess",
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

        public ResponseMessage UpdateVariant(UpdateVariantDTO updateVariantDTO)
        {
            var getVariant = db.ProductVariant.Include(x => x.Product).FirstOrDefault(x => x.VariantID == updateVariantDTO.VariantID);
            if (getVariant == null)
            {
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Variant Not Found",
                    Data = new int[0],
                    StatusCode = 404
                };
            }

            var image = Ultils.SaveImage(updateVariantDTO.VariantImage!, env);
            getVariant.VariantColor = updateVariantDTO.VariantColor ?? getVariant.VariantColor!;
            getVariant.VariantSize = updateVariantDTO.VariantSize ?? getVariant.VariantSize!;
            getVariant.VariantImg = image ?? getVariant.VariantImg;

            db.ProductVariant.Update(getVariant);
            db.SaveChanges();
            return new ResponseMessage
            {
                Success = true,
                Message = "Sucess",
                Data = null,
                StatusCode = 200
            };
        }

        public ResponseMessage UpdateVariantQuantity(RestockDTO restockDTO)
        {
            var getVariant = db.ProductVariant.Include(x => x.Product).FirstOrDefault(x => x.VariantID == restockDTO.VariantID);
            if (getVariant == null)
            {
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Variant Not Found",
                    Data = new int[0],
                    StatusCode = 404
                };
            }
            getVariant.VariantQuantity += restockDTO.Quantity;

            Import newImport = new()
            {
                ImportDate = DateTime.Now,
                VariantID = restockDTO.VariantID,
                Quantity = restockDTO.Quantity,
            };

            if (getVariant.VariantQuantity != 0 && getVariant.Product.ProductStatus == "Out of stock")
            {
                getVariant.Product.ProductStatus = "Still in stock";
                db.Product.Update(getVariant.Product);
            }

            db.Import.Add(newImport);
            db.ProductVariant.Update(getVariant);
            db.SaveChanges();
            return new ResponseMessage
            {
                Success = true,
                Message = "Sucess",
                Data = null,
                StatusCode = 200
            };
        }

        public ResponseMessage DeleteVariant(int variantID)
        {
            var checkDelete = db.ProductVariant
                .Include(x => x.Product).ThenInclude(x => x.ProductVariants)
                .FirstOrDefault(x => x.VariantID == variantID);
            if (checkDelete != null)
            {
                checkDelete.VariantQuantity = 0;
                db.ProductVariant.Update(checkDelete);
                if (checkDelete.Product.ProductVariants.Sum(x => x.VariantQuantity) == 0)
                {
                    checkDelete.Product.ProductStatus = "Out of stock";
                    db.Product.Update(checkDelete.Product);
                }

                db.SaveChanges();
                return new ResponseMessage
                {
                    Success = true,
                    Message = "Success",
                    Data = checkDelete,
                    StatusCode = 200
                };
            }

            return new ResponseMessage
            {
                Success = false,
                Message = "Variant Not Found",
                Data = checkDelete,
                StatusCode = 404
            };
        }
    }
}

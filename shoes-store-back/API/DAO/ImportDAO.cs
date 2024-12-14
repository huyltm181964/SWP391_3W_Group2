using API.Data;
using API.DTOs.RequestDTO;
using API.DTOs.ResponseDTO;
using API.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Net;

namespace API.DAO
{
    public class ImportDAO
    {
        private readonly ShoesDbContext db;
        public ImportDAO(ShoesDbContext db)
        {
            this.db = db;
        }

        //Don gian de hieu
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

        //Lay product detail thoi
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

        //Lấy 2 list import và export gộp thành 1
        public ResponseMessage GetProductHistory(int variantId)
        {
            //Lấy 2 list by variant id
            List<Import> imports = db.Import.Where(x => x.VariantID == variantId).ToList();
            List<Export> exports = db.Export.Where(x => x.VariantID == variantId).ToList();

            //Tạo list StockResponse để gộp 2 list thành 1
            List<StockResponse> stocks = new List<StockResponse>();

            //Gộp lại thành StockResponse
            stocks.AddRange(imports.Select(x => new StockResponse
            {
                Id = x.ImportID,
                Location = x.ImportLocation,
                Date = x.ImportDate,
                Quantity = x.Quantity,
                UnitPrice = x.ImportPrice,
                Type = "Import"
            }));

            //Gộp lại thành StockResponse
            stocks.AddRange(exports.Select(x => new StockResponse
            {
                Id = x.ExportID,
                Location = x.ExportLocation,
                Date = x.ExportDate,
                Quantity = x.Quantity,
                UnitPrice = 0,
                Type = "Export"
            }));

            //Order stocks by desc
            stocks = stocks.OrderByDescending(x => x.Date).ToList();
            return new ResponseMessage
            {
                Success = true,
                Message = "Product history retrieved successfully.",
                Data = stocks,
                StatusCode = 200
            };
        }

        public ResponseMessage GetAllImport()
        {
            var listImport = db.Import.ToList();

            return new ResponseMessage
            {
                Success = true,
                Message = "List Import Ok",
                Data = listImport,
                StatusCode = 200
            };
        }

            public ResponseMessage GetImportDetails()
        {
            var importDetails = db.ImportDetail
                .Include(d => d.Variant)
                .ThenInclude(v => v.Product)
                .Select(detail => new
                {
                    ProductName = detail.Variant.Product.ProductName,
                    Size = detail.Variant.VariantSize,
                    Color = detail.Variant.VariantColor,
                    Quantity = detail.Quantity,
                    UnitPrice = detail.UnitPrice,
                    TotalPrice = detail.Quantity * detail.UnitPrice
                })
                .ToList();

            return new ResponseMessage
            {
                Success = true,
                Message = "Import details fetched successfully.",
                Data = importDetails,
                StatusCode = 200
            };
        }

        //Nhập kho
        public ResponseMessage ImportProduct(ImportDTO importDTO)
        {
            var import = new Import
            {
                Supplier = importDTO.Supplier,
                Phone = importDTO.Phone,
                ImportDate = DateTime.Now,
                ImportLocation = $"{importDTO.City}, {importDTO.District}, {importDTO.Ward}, {importDTO.AddressDetail}",
                ImportStaffID = importDTO.ImportStaffID
            };

            db.Import.Add(import);
            db.SaveChanges();

            var importDetails = new List<ImportDetail>();

            foreach (var variantDTO in importDTO.VariantDetails)
            {
                var getProduct = db.Product.FirstOrDefault(x => x.ProductID == variantDTO.ProductID);
                if (getProduct == null)
                {
                    return new ResponseMessage
                    {
                        Success = false,
                        Message = $"Product with ID {variantDTO.ProductID} not found.",
                        StatusCode = 404
                    };
                }

                var variant = db.ProductVariant.FirstOrDefault(x => x.VariantSize == variantDTO.VariantSize
                                                                     && x.ProductID == getProduct.ProductID
                                                                     && x.VariantColor == variantDTO.VariantColor);

                if (variant == null)
                {
                    variant = new ProductVariant
                    {
                        ProductID = getProduct.ProductID,
                        VariantSize = variantDTO.VariantSize,
                        VariantColor = variantDTO.VariantColor,
                        VariantQuantity = variantDTO.Quantity
                    };

                    db.ProductVariant.Add(variant);
                    db.SaveChanges();
                }
                else
                {
                    variant.VariantQuantity += variantDTO.Quantity;
                    db.ProductVariant.Update(variant);
                }

                var importDetail = new ImportDetail
                {
                    ImportID = import.ImportID,
                    VariantID = variant.VariantID,
                    Quantity = variantDTO.Quantity,
                    UnitPrice = variantDTO.ImportPrice
                };

                importDetails.Add(importDetail);
            }

            db.ImportDetail.AddRange(importDetails);
            db.SaveChanges();

            return new ResponseMessage
            {
                Success = true,
                Message = "Products imported successfully.",
                Data = new
                {
                    Import = import,
                    Details = importDetails
                },
                StatusCode = 200
            };
        }

        //Cập nhật thông tin nhập kho
        public ResponseMessage UpdateImportProduct(UpdateImportDTO updateImportDTO)
        {
            var existingImport = db.Import
                .FirstOrDefault(x => x.ImportID == updateImportDTO.ImportID);

            if (existingImport == null)
            {
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Import record not found.",
                    Data = null,
                    StatusCode = 404
                };
            }

            existingImport.ImportPrice = updateImportDTO.ImportPrice;
            existingImport.ImportLocation = $"{updateImportDTO.City}, {updateImportDTO.District}, {updateImportDTO.Ward}, {updateImportDTO.AddressDetail}"; //Gộp tất cả thành location

            db.Import.Update(existingImport);
            db.SaveChanges();

            return new ResponseMessage
            {
                Success = true,
                Message = "Import product updated successfully.",
                Data = existingImport,
                StatusCode = 200
            };
        }
    }
}

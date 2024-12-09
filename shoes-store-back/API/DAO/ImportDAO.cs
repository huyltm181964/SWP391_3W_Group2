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

        //Nhập kho
        public ResponseMessage AddImportProduct(ImportDTO importDTO)
        {
            //Nhập vào variant cụ thể
            var variant = db.ProductVariant
                .Include(x => x.Product)
                .ThenInclude(x => x.ProductVariants)
                .FirstOrDefault(x => x.VariantID == importDTO.VariantID);

            if (variant == null)
            {
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Variant not found.",
                    Data = null,
                    StatusCode = 404
                };
            }

            var import = new Import
            {
                ImportDate = DateTime.Now,
                Quantity = importDTO.Quantity,
                ImportPrice = importDTO.ImportPrice,
                VariantID = importDTO.VariantID,
                ImportLocation = $"{importDTO.City}, {importDTO.District}, {importDTO.Ward}, {importDTO.AddressDetail}" //Gộp tất cả thành location
            };

            //Sau khi nhập thì variant sẽ đc tăng quantity
            variant.VariantQuantity += importDTO.Quantity;

            db.ProductVariant.Update(variant);
            db.Import.Add(import);
            db.SaveChanges();

            return new ResponseMessage
            {
                Success = true,
                Message = "Import product added successfully.",
                Data = import,
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

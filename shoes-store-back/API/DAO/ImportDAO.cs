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

        public ResponseMessage GetProducts()
        {
            try
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
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return new ResponseMessage
                {
                    Success = false,
                    StatusCode = (int)HttpStatusCode.InternalServerError,
                    Message = "An error occurred: " + ex.Message,
                    Data = null,
                };
            }
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

        public ResponseMessage GetProductHistory(int variantId)
        {
            var checkDelete = db.ProductVariant
                .Include(x => x.Product).ThenInclude(x => x.ProductVariants)
                .FirstOrDefault(x => x.VariantID == variantId);

            if (checkDelete == null)
            {
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Variant Not Found",
                    Data = null,
                    StatusCode = 404
                };
            }

            List<Import> imports = db.Import.Where(x => x.VariantID == variantId).ToList();
            List<Export> exports = db.Export.Where(x => x.VariantID == variantId).ToList();

            List<StockDTO> stocks = new List<StockDTO>();

            stocks.AddRange(imports.Select(x => new StockDTO
            {
                Id = $"Import-{x.ImportID:D2}",
                Location = x.ImportLocation,
                Date = x.ImportDate,
                Quantity = x.Quantity,
                Type = "Import"
            }));

            stocks.AddRange(exports.Select(x => new StockDTO
            {
                Id = $"Export-{x.ExportID:D2}",
                Location = x.ExportLocation,
                Date = x.ExportDate,
                Quantity = x.Quantity,
                Type = "Export"
            }));

            stocks = stocks.OrderByDescending(x => x.Date).ToList();
            return new ResponseMessage
            {
                Success = true,
                Message = "Product history retrieved successfully.",
                Data = stocks,
                StatusCode = 200
            };
        }
    }
}

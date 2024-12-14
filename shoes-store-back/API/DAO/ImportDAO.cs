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

        public ResponseMessage GetAllImports()
        {
            var importList = db.Import.ToList();

            return new ResponseMessage
            {
                Success = true,
                Message = "Import list fetched successfully",
                Data = importList,
                StatusCode = 200
            };
        }

        public ResponseMessage GetImportDetails(int importId)
        {
            var importDetails = db.ImportDetail
                .Where(d => d.ImportID == importId)
                .Include(d => d.Variant)
                    .ThenInclude(v => v.Product)
                .Include(d => d.Import)
                    .ThenInclude(i => i.ImportStaff)
                .Select(detail => new
                {
                    ImportID = detail.ImportID, 
                    ProductID = detail.Variant.Product.ProductID,
                    ProductName = detail.Variant.Product.ProductName,
                    ProductImg = detail.Variant.Product.ProductImg,
                    Size = detail.Variant.VariantSize,
                    Color = detail.Variant.VariantColor,
                    Quantity = detail.Quantity,
                    UnitPrice = detail.UnitPrice,
                    TotalPrice = detail.Quantity * detail.UnitPrice,
                    StaffID = detail.Import.ImportStaff.AccountID,
                    StaffName = detail.Import.ImportStaff.AccountName
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

    }
}

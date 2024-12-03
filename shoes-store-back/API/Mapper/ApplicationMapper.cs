using API.DTOs;
using API.DTOs.RequestDTO;
using API.DTOs.ResponseDTO;
using API.Models;
using AutoMapper;

namespace API.Mapper
{
    public class ApplicationMapper : Profile
    {
        public ApplicationMapper()
        {
        
            CreateMap<RegisterDTO, Account>();
            
            CreateMap<Account, RegisterDTO>();
            CreateMap<Account, ProfileDTO>()
                .ForMember(dest => dest.Avatar, opt => opt.Ignore());
            CreateMap<Account, ChangePasswordDTO>();
    
               
            
            CreateMap<Cart, CartItemDTO>();
            CreateMap<ProductVariant, CartItemResponse>()
            .ForMember(dest => dest.VariantImg, opt => opt.MapFrom(src => src.VariantImg))
            .ForMember(dest => dest.VariantSize, opt => opt.MapFrom(src => src.VariantSize))
            .ForMember(dest => dest.VariantColor, opt => opt.MapFrom(src => src.VariantColor))
            .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.VariantQuantity))
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.ProductName))
            .ForMember(dest => dest.ProductPrice, opt => opt.MapFrom(src => (double?)src.Product.ProductPrice))
            .ForMember(dest => dest.ProductImg, opt => opt.MapFrom(src => src.Product.ProductImg))
            .ForMember(dest => dest.ProductCategory, opt => opt.MapFrom(src => src.Product.ProductCategory))
            .ForMember(dest => dest.ProductDescription, opt => opt.MapFrom(src => src.Product.ProductDescription));


            CreateMap<CartItem, CartItemResponse>()
                        .ForMember(dest => dest.VariantID, opt => opt.MapFrom(src => src.Variant != null ? src.Variant.VariantID : (int?)null))
                        .ForMember(dest => dest.VariantImg, opt => opt.MapFrom(src => src.Variant != null ? src.Variant.VariantImg : null))
                        .ForMember(dest => dest.VariantSize, opt => opt.MapFrom(src => src.Variant != null ? src.Variant.VariantSize : null))
                        .ForMember(dest => dest.VariantColor, opt => opt.MapFrom(src => src.Variant != null ? src.Variant.VariantColor : null))
                        .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Variant != null ? src.Variant.Product.ProductName : null))
                        .ForMember(dest => dest.ProductPrice, opt => opt.MapFrom(src => src.Variant != null ? (double?)src.Variant.Product.ProductPrice : null))
                        .ForMember(dest => dest.ProductImg, opt => opt.MapFrom(src => src.Variant != null ? src.Variant.Product.ProductImg : null))
                        .ForMember(dest => dest.ProductCategory, opt => opt.MapFrom(src => src.Variant != null ? src.Variant.Product.ProductCategory : null))
                        .ForMember(dest => dest.ProductDescription, opt => opt.MapFrom(src => src.Variant != null ? src.Variant.Product.ProductDescription : null))
                        .ForMember(dest => dest.Quantity, opt => opt.MapFrom(src => src.Quantity));

            CreateMap<Order, CheckOutReponse>()
                       .ForMember(dest => dest.OrderID, opt => opt.MapFrom(src => src.OrderID))
                       .ForMember(dest => dest.OrderAddress, opt => opt.MapFrom(src => src.OrderAddress ?? "Unknown Address"))
                       .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom(src => (double)src.TotalPrice))
                       .ForMember(dest => dest.OrderDate, opt => opt.MapFrom(src => src.OrderDate))
                       .ForMember(dest => dest.OrderStatus, opt => opt.MapFrom(src => src.OrderStatus ?? "Pending"));

            CreateMap<OrderDetail, OrderDetailResponse>()
           .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Variant.Product.ProductName))
           .ForMember(dest => dest.ProductImg, opt => opt.MapFrom(src => src.Variant.Product.ProductImg))
           .ForMember(dest => dest.ProductCategory, opt => opt.MapFrom(src => src.Variant.Product.ProductCategory))
           .ForMember(dest => dest.ProductDescription, opt => opt.MapFrom(src => src.Variant.Product.ProductDescription))
           .ForMember(dest => dest.VariantImg, opt => opt.MapFrom(src => src.Variant.VariantImg))
           .ForMember(dest => dest.VariantSize, opt => opt.MapFrom(src => src.Variant.VariantSize))
           .ForMember(dest => dest.VariantColor, opt => opt.MapFrom(src => src.Variant.VariantColor))
           .ForMember(dest => dest.OrderQuantity, opt => opt.MapFrom(src => src.Quantity))
           .ForMember(dest => dest.UnitPrice, opt => opt.MapFrom(src => src.UnitPrice))
           .ForMember(dest => dest.TotalItemPrice, opt => opt.MapFrom(src => src.Quantity * src.UnitPrice));

            CreateMap<Order, GetAllOrderReponse>()
                .ForMember(dest => dest.AccountEmail, opt => opt.MapFrom(src => src.Account.AccountEmail != null ? src.Account.AccountEmail : null))
                .ForMember(dest => dest.AccountName, opt => opt.MapFrom(src => src.Account.AccountName != null ? src.Account.AccountName : null))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Account.Phone != null ? src.Account.Phone : null))
                .ForMember(dest => dest.AccountAddress, opt => opt.MapFrom(src => src.Account.Phone != null ? src.Account.Phone : null))
                .ForMember(dest => dest.OrderAddress, opt => opt.MapFrom(src => src.OrderAddress != null ? src.OrderAddress : null))
                .ForMember(dest => dest.OrderDate, opt => opt.MapFrom(src => src.OrderDate))
                .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom(src => src.TotalPrice));

            CreateMap<Comment, CommentResponseDTO>()
                .ForMember(dest => dest.AccountName, opt => opt.MapFrom(src => src.Account.AccountName != null ? src.Account.AccountName : null))
                .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content != null ? src.Content : null))
                .ForMember(dest => dest.CommentDate, opt => opt.MapFrom(src => src.CreatedDate != null ? src.CreatedDate : (DateTime)default));

            CreateMap<Account, ProfileResponse>();
            CreateMap<Account, AccountResponse>();
            CreateMap<ProductVariant, VariantResponseDTO>()
                        .ForMember(dest => dest.ProductID, opt => opt.MapFrom(src => src.Product.ProductID))
                        .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.ProductName))
                        .ForMember(dest => dest.ProductPrice, opt => opt.MapFrom(src => src.Product.ProductPrice))
                        .ForMember(dest => dest.ProductImg, opt => opt.MapFrom(src => src.Product.ProductImg))
                        .ForMember(dest => dest.ProductCategory, opt => opt.MapFrom(src => src.Product.ProductCategory))
                        .ForMember(dest => dest.ProductDescription, opt => opt.MapFrom(src => src.Product.ProductDescription))
                        .ForMember(dest => dest.ProductStatus, opt => opt.MapFrom(src => src.Product.ProductStatus))
                        .ForMember(dest => dest.VairantImage, opt => opt.MapFrom(src => src.VariantImg));
            CreateMap<Product, ProductResponseDTO>();
        }



    }
    }


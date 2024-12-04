using API.DTOs;
using API.DTOs.RequestDTO;
using API.DTOs.ResponseDTO;
using API.Models;
using AutoMapper;

namespace API.Utils
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

            CreateMap<Account, ProfileResponse>();
            CreateMap<Account, AccountResponse>();
        }
    }
}


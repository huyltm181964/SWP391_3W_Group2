
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

        //Lấy list variant nè
        public ResponseMessage GetAll()
        {
            //Đơn giản là lấy list variant thoi
            var getVariant = db.ProductVariant.ToList();
            if (getVariant != null)
            {
                //Trường hợp ko rỗng thì mình sẽ trả về list
                return new ResponseMessage
                {
                    Success = true,
                    Message = "Success",
                    Data = getVariant,
                    StatusCode = 200
                };
            }
            //Còn nếu thì mình trả về empty array
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = new int[0],
                StatusCode = 200
            };
        }
    }
}

using API.Data;
using API.DTOs.RequestDTO;
using API.DTOs.ResponseDTO;
using API.Models;
using API.Utils;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.DAO
{
    public class CommentDAO
    {
        private readonly ShoesDbContext db;
        private readonly IMapper m;
        public CommentDAO(ShoesDbContext db, IMapper _m)
        {
            this.db = db;
            this.m = _m;
        }

        public ResponseMessage CreateComment(int accountID, CommentDTO commentDTO)
        {
            var getAccount = db.Account
                .Include(x => x.Orders)
                .ThenInclude(x => x.OrderDetails)
                .ThenInclude(x => x.Variant)
                .ThenInclude(x => x.Product)
                .FirstOrDefault(x => x.AccountID == accountID)!;

            if (!getAccount.Orders.Any(order =>
                    order.OrderDetails.Any(orderDetail =>
                        orderDetail.Variant!.Product!.ProductID == commentDTO.ProductID)))
            {
                return new ResponseMessage
                {
                    Success = false,
                    Message = "You haven't bought this product before",
                    Data = null,
                    StatusCode = 400
                };
            }

            Comment createComment = new Comment
            {
                Rate = commentDTO.Rate,
                Content = commentDTO.Content,
                CreatedDate = DateTime.Now,
                AccountID = getAccount.AccountID,
                ProductID = commentDTO.ProductID
            };
            db.Comment.Add(createComment);
            db.SaveChanges();
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = m.Map<CommentResponseDTO>(createComment),
                StatusCode = 200
            };
        }

        public ResponseMessage GetCommentInProduct(int accountID, int productID)
        {
            var getComment = db.Comment
                               .Include(x => x.Account)
                               .FirstOrDefault(x => x.AccountID == accountID && x.ProductID == productID);
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = getComment,
                StatusCode = 200
            };
        }

        public ResponseMessage DeleteComment(int accountID, int productID)
        {
            var getComment = db.Comment.FirstOrDefault(x => x.AccountID == accountID && x.ProductID == productID);
            if (getComment != null)
            {
                db.Comment.Remove(getComment);
                db.SaveChanges();
                return new ResponseMessage
                {
                    Success = true,
                    Message = "Success",
                    Data = getComment,
                    StatusCode = 200
                };
            }
            return new ResponseMessage
            {
                Success = false,
                Message = "Comment not found",
                Data = new int[0],
                StatusCode = 404
            };
        }

        public ResponseMessage UpdateComment(int accountID, CommentDTO commentDTO)
        {
            var getComment = db.Comment.FirstOrDefault(x => x.AccountID == accountID && x.ProductID == commentDTO.ProductID);
            if (getComment != null)
            {
                getComment.Rate = commentDTO.Rate;
                getComment.Content = commentDTO.Content;
                db.Comment.Update(getComment);
                db.SaveChanges();
                return new ResponseMessage
                {
                    Success = true,
                    Message = "Success",
                    Data = getComment,
                    StatusCode = 200
                };
            }
            return new ResponseMessage
            {
                Success = false,
                Message = "Comment not found",
                Data = new int[0],
                StatusCode = 404
            };
        }
    }
}


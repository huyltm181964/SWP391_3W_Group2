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

        public ResponseMessage GetAllReportedComment()
        {
            var reportedComments = db.Comment.Where(comment => comment.IsReported).ToList();
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = reportedComments,
                StatusCode = 200
            };
        }

        public ResponseMessage CreateComment(int accountID, CommentDTO commentDTO)
        {
            var getAccount = db.Account
                .Include(x => x.Orders)
                .ThenInclude(x => x.OrderDetails)
                .ThenInclude(x => x.Variant)
                .ThenInclude(x => x.Product)
                .Include(x => x.BlacklistComments)
                .FirstOrDefault(x => x.AccountID == accountID)!;

            if (!getAccount.Orders.Any(order =>
                    order.OrderDetails.Any(orderDetail =>
                        orderDetail.Variant!.Product!.ProductID == commentDTO.ProductID)))
            {
                return new ResponseMessage
                {
                    Success = false,
                    Message = "You need to buy this product before commenting",
                    Data = null,
                    StatusCode = 400
                };
            }

            if (getAccount.BlacklistComments.Any(comment => comment.ProductID == commentDTO.ProductID))
            {
                return new ResponseMessage
                {
                    Success = false,
                    Message = "You comment permission on this product has been taken due to being banned",
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
                Message = "Comment successfully",
                Data = null,
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
                    Message = "Update comment successfully",
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

        public ResponseMessage BanComment(int accountID, int productID, string reason)
        {
            var getComment = db.Comment
                .FirstOrDefault(c => c.AccountID == accountID
                                    && c.ProductID == productID
                                    && c.IsReported);
            if (getComment == null)
            {
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Comment not found",
                    Data = new int[0],
                    StatusCode = 404
                };
            }

            var blacklistComment = new BlacklistComment
            {
                AccountID = accountID,
                ProductID = productID,
                Reason = reason
            };

            var notification = new Notification
            {
                AccountID = accountID,
                Title = "You have a new comment being banned",
                Description = 
                $"Your comment in product " +
                $"{db.Product.FirstOrDefault(x => x.ProductID == productID)?.ProductName}" +
                $" is banned because it {reason}"
            };

            db.Comment.Remove(getComment);
            db.BlacklistComment.Add(blacklistComment);
            db.Notification.Add(notification);
            db.SaveChanges();
            return new ResponseMessage
            {
                Success = true,
                Message = "Success",
                Data = getComment,
                StatusCode = 200
            };
        }

        public ResponseMessage ReportComment(int accountID, int productID)
        {
            var getComment = db.Comment
                .FirstOrDefault(c => c.AccountID == accountID
                                    && c.ProductID == productID);
            if (getComment == null)
            {
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Comment not found",
                    Data = null,
                    StatusCode = 404
                };
            }

            getComment.IsReported = true;
            db.Comment.Update(getComment);
            db.SaveChanges();
            return new ResponseMessage
            {
                Success = true,
                Message = "Unreport comment successfully",
                Data = null,
                StatusCode = 200
            };
        }

        public ResponseMessage UnreportComment(int accountID, int productID)
        {
            var getComment = db.Comment
                .FirstOrDefault(c => c.AccountID == accountID
                                    && c.ProductID == productID
                                    && c.IsReported);
            if (getComment == null)
            {
                return new ResponseMessage
                {
                    Success = false,
                    Message = "Comment not found",
                    Data = null,
                    StatusCode = 404
                };
            }

            getComment.IsReported = false;
            db.Comment.Update(getComment);
            db.SaveChanges();
            return new ResponseMessage
            {
                Success = true,
                Message = "Unreport comment successfully",
                Data = null,
                StatusCode = 200
            };
        }
    }
}


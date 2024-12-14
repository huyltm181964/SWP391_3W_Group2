using API.Data;
using API.DTOs.RequestDTO;
using API.DTOs.ResponseDTO;
using API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace API.DAO
{
    public class ContactDAO
    {
        private readonly ShoesDbContext db;
        public ContactDAO(ShoesDbContext db)
        {
            this.db = db;
        }

        public ResponseMessage AddContact(int accountID, ContactUsDTO contactUsDTO)
        {

            var contact = new Contact
            {
                AccountID = accountID,
                CreatedDate = DateTime.Now,
                Title = contactUsDTO.Name + " - " + contactUsDTO.Title,
                Description = contactUsDTO.Description,
            };

            db.Contact.Add(contact);
            db.SaveChanges();

            return new ResponseMessage
            {
                Data = null,
                Message = "Contact successfully",
                StatusCode = 200,
                Success = true,
            };
        }

        public ResponseMessage GetUserHistoryContact(int accountID)
        {
            var account = db.Account.Include(x => x.Contacts).FirstOrDefault(x => x.AccountID == accountID);

            return new ResponseMessage
            {
                Data = account.Contacts,
                Message = "Success",
                StatusCode = 200,
                Success = true,
            };
        }

        //Lấy all contact
        public ResponseMessage GetAllContact()
        {
            return new ResponseMessage
            {
                Data = db.Contact.ToList(),
                Message = "Success",
                StatusCode = 200,
                Success = true,
            };
        }

        //Trả lời tin nhắn của khách hàng
        public ResponseMessage AnswerContact(int contactID, string answer, int staffID)
        {
            //Lấy contact by id
            var contact = db.Contact.Include(c => c.Account).FirstOrDefault(c => c.ContactID == contactID);

            if (contact == null)
            {
                return new ResponseMessage
                {
                    Data = null,
                    Message = "Contact not found",
                    StatusCode = 404,
                    Success = false,
                };
            }

            var staff = db.Account.FirstOrDefault(s => s.AccountID == staffID)!;

            //Trả lời nè
            contact.Answer = answer;
            contact.AnswerDate = DateTime.Now;
            contact.AnsweredStaffName = staff.AccountName;
            db.Contact.Update(contact);

            //Thông báo cảm ơn
            var notification = new Notification()
            {
                AccountID = contact.AccountID,
                Title = $"Answered contact #{contactID}",
                Description = $"Dear {contact.Account!.AccountName}," +
                $"\r\n\r\nThank you for reaching out to us. We have reviewed your request #{contactID} and provided a response. If you have any further questions or need additional assistance, please feel free to contact us again." +
                $"\r\n\r\nBest regards," +
                $"\r\nShoes store's staff"
            };
            db.Notification.Add(notification);

            db.SaveChanges();

            return new ResponseMessage
            {
                Data = null,
                Message = "Update contact successfully",
                StatusCode = 200,
                Success = true,
            };
        }

        // Từ chối nhận contact vì quá tục tĩu hoặc khó để trả lời
        public ResponseMessage RejectContact(int contactID, int staffID)
        {
            var contact = db.Contact.Include(c => c.Account).FirstOrDefault(c => c.ContactID == contactID);
            if (contact == null)
            {
                return new ResponseMessage
                {
                    Data = null,
                    Message = "Contact not found",
                    StatusCode = 404,
                    Success = false,
                };
            }

            var staff = db.Account.FirstOrDefault(a => a.AccountID == staffID)!;

            contact.AnswerDate = DateTime.Now;
            contact.AnsweredStaffName = staff.AccountName;
            contact.IsRejected = true;
            db.Contact.Update(contact);

            //Gui thong bao 
            var notification = new Notification()
            {
                AccountID = contact.AccountID,
                Title = $"Rejected contact #{contactID}",
                Description = $"Dear {contact.Account!.AccountName}," +
                $"\r\n\r\nThank you for reaching out to us. We appreciate your interest; however, we regret to inform you that we are unable to proceed with your request #{contactID} at this time. If there is anything else we can assist you with, please don’t hesitate to let us know." +
                $"\r\n\r\nBest regards," +
                $"\r\nShoes store's staff"
            };
            db.Notification.Add(notification);

            db.SaveChanges();

            return new ResponseMessage
            {
                Data = null,
                Message = "Reject the contact successfully",
                StatusCode = 200,
                Success = true,
            };
        }
    }
}

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
                Title = contactUsDTO.Title,
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

        public ResponseMessage GetUnanswerContact()
        {
            var contacts = db.Contact.Where(c => !c.IsRejected && string.IsNullOrEmpty(c.Answer));

            return new ResponseMessage
            {
                Data = contacts,
                Message = "Success",
                StatusCode = 200,
                Success = true,
            };
        }

        public ResponseMessage AnswerContact(int contactID, string answer)
        {
            var contact = db.Contact.FirstOrDefault(c => c.ContactID == contactID);

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

            contact.Answer = answer;
            db.Contact.Update(contact);
            db.SaveChanges();

            return new ResponseMessage
            {
                Data = null,
                Message = "Update contact successfully",
                StatusCode = 200,
                Success = true,
            };
        }

        public ResponseMessage RejectContact(int contactID)
        {
            var contact = db.Contact.FirstOrDefault(c => c.ContactID == contactID);

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

            contact.IsRejected = true;
            db.Contact.Update(contact);
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

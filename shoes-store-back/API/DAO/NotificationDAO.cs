using API.Data;
using API.DTOs.ResponseDTO;
using Microsoft.EntityFrameworkCore;

namespace API.DAO
{
    public class NotificationDAO
    {
        private readonly ShoesDbContext db;
        public NotificationDAO(ShoesDbContext db)
        {
            this.db = db;
        }

        public ResponseMessage GetAllNotifications(int accountID)
        {
            var account = db.Account
                .Include(x => x.Notifications)
                .FirstOrDefault(x => x.AccountID == accountID);
            return new ResponseMessage()
            {
                Data = account?.Notifications ?? [],
                Message = "Success",
                StatusCode = 200,
                Success = true
            };
        }

        public ResponseMessage GetNotificationDetail(int accountID, int notificationID)
        {
            var account = db.Account
                .Include(x => x.Notifications)
                .FirstOrDefault(x => x.AccountID == accountID);

            var notification = account?.Notifications.FirstOrDefault(x => x.NotificationID == notificationID);
            if (notification == null)
            {
                return new ResponseMessage()
                {
                    Data = null,
                    Message = "Notification not found",
                    StatusCode = 404,
                    Success = false
                };
            }

            if (!notification.IsRead)
            {
                notification.IsRead = true;
                db.Notification.Update(notification);
                db.SaveChanges();
            }

            return new ResponseMessage()
            {
                Data = notification,
                Message = "Success",
                StatusCode = 200,
                Success = true
            };
        }

        public ResponseMessage ClearNotifications(int accountID)
        {
            var account = db.Account
                .Include(x => x.Notifications)
                .FirstOrDefault(x => x.AccountID == accountID);

            foreach (var notification in account.Notifications)
            {
                if (notification.IsRead) { 
                    db.Notification.Remove(notification);
                }
            }

            db.SaveChanges();

            return new ResponseMessage()
            {
                Data = null,
                Message = "Success",
                StatusCode = 200,
                Success = true
            };
        }
    }
}

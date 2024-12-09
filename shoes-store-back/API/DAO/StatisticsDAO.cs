using API.Data;
using API.DTOs.ResponseDTO;
using Microsoft.EntityFrameworkCore;

namespace API.DAO
{
    public class StatisticsDAO
    {
        private readonly ShoesDbContext db;
        public StatisticsDAO(ShoesDbContext db)
        {
            this.db = db;
        }

        //Lấy tổng số bình luận và so sánh giữa tháng này và tháng trước.
        public StatisticResponseDTO TotalComments()
        {
            var currentMonth = DateTime.Now.Month; 
            var previousMonth = currentMonth == 1 ? 12 : currentMonth - 1;// Lấy tháng trước. Nếu tháng hiện tại là 1 thì lấy tháng 12. con khong thi lay thang hien tại trừ tháng trước là ra
            var currentYear = DateTime.Now.Year;
            var previousYear = currentMonth == 1 ? currentYear - 1 : currentYear;//lấy năm. nếu tháng hiện tại là 1 thì lấy năm trước còn không thì lấy năm hiện tại

            var totalComments = db.Comment.Count(); //Lấy tổng comment
            var commentsLastMonth = db.Comment.Count(x => x.CreatedDate.Month == previousMonth && x.CreatedDate.Year == previousYear);// Lấy tổng comment của tháng trước
            var commentsThisMonth = db.Comment.Count(x => x.CreatedDate.Month == currentMonth && x.CreatedDate.Year == currentYear); // Lấy tổng comment của tháng này

            return new()
            {
                Count = totalComments, //Tổng comment
                Extra = commentsThisMonth - commentsLastMonth, //Số liệu so với tháng trước
                Percentage = commentsLastMonth > 0 ? (double)(commentsThisMonth - commentsLastMonth) / commentsLastMonth * 100 : 0 //Phần trăm so với tháng trước tăng hay giảm
            };
        }

        //Lấy tổng số người dùng và so sánh giữa tháng này và tháng trước.
        public StatisticResponseDTO TotalUsers()
        {
            //Giống trên nhưng này là Account
            var currentMonth = DateTime.Now.Month;
            var previousMonth = currentMonth == 1 ? 12 : currentMonth - 1;
            var currentYear = DateTime.Now.Year;
            var previousYear = currentMonth == 1 ? currentYear - 1 : currentYear;

            var totalUsers = db.Account.Count();
            var usersLastMonth = db.Account.Count(x => x.CreatedAt.Month == previousMonth && x.CreatedAt.Year == previousYear);
            var usersThisMonth = db.Account.Count(x => x.CreatedAt.Month == currentMonth && x.CreatedAt.Year == currentYear);

            return new()
            {
                Count = totalUsers,
                Extra = usersThisMonth - usersLastMonth,
                Percentage = usersLastMonth > 0 ? (double)(usersThisMonth - usersLastMonth) / usersLastMonth * 100 : 0
            };
        }

        
        // Lấy tổng số đơn hàng và so sánh giữa tháng này và tháng trước.
     
        public StatisticResponseDTO TotalOrders()
        {
            //Giống trên nhưng này là Order
            var currentMonth = DateTime.Now.Month;
            var previousMonth = currentMonth == 1 ? 12 : currentMonth - 1;
            var currentYear = DateTime.Now.Year;
            var previousYear = currentMonth == 1 ? currentYear - 1 : currentYear;

            var totalOrders = db.Order.Count();
            var ordersLastMonth = db.Order.Count(x => x.OrderDate.Month == previousMonth && x.OrderDate.Year == previousYear);
            var ordersThisMonth = db.Order.Count(x => x.OrderDate.Month == currentMonth && x.OrderDate.Year == currentYear);

            return new()
            {
                Count = totalOrders,
                Extra = ordersThisMonth - ordersLastMonth,
                Percentage = ordersLastMonth > 0 ? (double)(ordersThisMonth - ordersLastMonth) / ordersLastMonth * 100 : 0
            };
        }

         // Lấy tổng doanh thu và so sánh giữa tháng này và tháng trước.
        public StatisticResponseDTO TotalRevenues()
        {
            //Giống trên nhưng này là doanh thu
            var currentMonth = DateTime.Now.Month;
            var previousMonth = currentMonth == 1 ? 12 : currentMonth - 1;
            var currentYear = DateTime.Now.Year;
            var previousYear = currentMonth == 1 ? currentYear - 1 : currentYear;

            var totalRevenues = db.Order.Sum(x => x.TotalPrice);
            var revenuesLastMonth = db.Order.Where(x => x.OrderDate.Month == previousMonth && x.OrderDate.Year == previousYear).Sum(x => x.TotalPrice);
            var revenuesThisMonth = db.Order.Where(x => x.OrderDate.Month == currentMonth && x.OrderDate.Year == currentYear).Sum(x => x.TotalPrice);

            return new()
            {
                Count = (double)totalRevenues,
                Extra = (double)(revenuesThisMonth - revenuesLastMonth),
                Percentage = revenuesLastMonth > 0 ? (double)((revenuesThisMonth - revenuesLastMonth) / revenuesLastMonth) * 100 : 0
            };
        }

         //Lấy doanh thu theo từng tháng trong năm hiện tại.
        public List<decimal> MonthlyRevenues()
        {
            //Đây là line chart chart và sẽ có 12 tháng
            var currentYear = DateTime.Now.Year;//Lấy năm hiện tại
            List<decimal> monthlyRevenues = new List<decimal>();

            for (int month = 1; month <= 12; month++)
            {
                var revenue = db.Order.Where(x => x.OrderDate.Month == month && x.OrderDate.Year == currentYear).Sum(x => x.TotalPrice);// Tính tổng số tiền của các order nào cùng tháng cùng năm
                monthlyRevenues.Add(revenue);
            }

            return monthlyRevenues;
        }
    }
}

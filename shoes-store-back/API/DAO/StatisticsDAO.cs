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

        /**
             * Lấy tổng số bình luận và so sánh giữa tháng này và tháng trước.
             * @return StatisticResponseDTO: Thống kê số lượng bình luận.
             */
        public StatisticResponseDTO TotalComments()
        {
            var currentMonth = DateTime.Now.Month;
            var previousMonth = currentMonth == 1 ? 12 : currentMonth - 1;
            var currentYear = DateTime.Now.Year;
            var previousYear = currentMonth == 1 ? currentYear - 1 : currentYear;

            var totalComments = db.Comment.Count();
            var commentsLastMonth = db.Comment.Count(x => x.CreatedDate.Month == previousMonth && x.CreatedDate.Year == previousYear);
            var commentsThisMonth = db.Comment.Count(x => x.CreatedDate.Month == currentMonth && x.CreatedDate.Year == currentYear);

            return new()
            {
                Count = totalComments,
                Extra = commentsThisMonth - commentsLastMonth,
                Percentage = commentsLastMonth > 0 ? (double)(commentsThisMonth - commentsLastMonth) / commentsLastMonth * 100 : 0
            };
        }

        /**
         * Lấy tổng số người dùng và so sánh giữa tháng này và tháng trước.
         * @return StatisticResponseDTO: Thống kê số lượng người dùng.
         */
        public StatisticResponseDTO TotalUsers()
        {
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

        /**
         * Lấy tổng số đơn hàng và so sánh giữa tháng này và tháng trước.
         * @return StatisticResponseDTO: Thống kê số lượng đơn hàng.
         */
        public StatisticResponseDTO TotalOrders()
        {
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

        /**
         * Lấy tổng doanh thu và so sánh giữa tháng này và tháng trước.
         * @return StatisticResponseDTO: Thống kê tổng doanh thu.
         */
        public StatisticResponseDTO TotalRevenues()
        {
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

        /**
         * Lấy doanh thu theo từng tháng trong năm hiện tại.
         * @return List<decimal>: Danh sách doanh thu của từng tháng.
         */
        public List<decimal> MonthlyRevenues()
        {
            var currentYear = DateTime.Now.Year;
            List<decimal> monthlyRevenues = new List<decimal>();

            for (int month = 1; month <= 12; month++)
            {
                var revenue = db.Order.Where(x => x.OrderDate.Month == month && x.OrderDate.Year == currentYear).Sum(x => x.TotalPrice);
                monthlyRevenues.Add(revenue);
            }

            return monthlyRevenues;
        }
    }
}

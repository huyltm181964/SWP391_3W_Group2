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

        public StatisticResponseDTO TotalComments()
        {
            var comments =  db.Comment.ToList();
            var commentsLastMonth = comments.Count(x => x.CreatedDate.Month == DateTime.Now.Month - 1);
            var commentsThisMonth = comments.Count(x => x.CreatedDate.Month == DateTime.Now.Month);

            return new()
            {
                Count= comments.Count,
                Extra = commentsThisMonth - commentsLastMonth,
                Percentage = commentsLastMonth > 0 ? (double)(commentsThisMonth - commentsLastMonth) / commentsLastMonth * 100 : 0
            };
        }

        public StatisticResponseDTO TotalUsers()
        {
            var users = db.Account.ToList();
            var usersLastMonth = users.Count(x => x.CreatedAt.Month == DateTime.Now.Month - 1);
            var usersThisMonth = users.Count(x => x.CreatedAt.Month == DateTime.Now.Month);

            return new()
            {
                Count = users.Count,
                Extra = usersThisMonth - usersLastMonth,
                Percentage = usersLastMonth > 0 ? (double)(usersThisMonth - usersLastMonth) / usersLastMonth * 100 : 0
            };
        }

        public StatisticResponseDTO TotalOrders()
        {
            var orders = db.Order.ToList();
            var ordersLastMonth = orders.Count(x => x.OrderDate.Month == DateTime.Now.Month - 1);
            var ordersThisMonth = orders.Count(x => x.OrderDate.Month == DateTime.Now.Month);

            return new()
            {
                Count = orders.Count,
                Extra = ordersThisMonth - ordersLastMonth,
                Percentage = ordersLastMonth > 0 ? (double)(ordersThisMonth - ordersLastMonth) / ordersLastMonth * 100 : 0
            };
        }

        public StatisticResponseDTO TotalRevenues()
        {
            var orders = db.Order.ToList();
            var revenuesLastMonth = orders.Where(x => x.OrderDate.Month == DateTime.Now.Month - 1).Sum(x => x.TotalPrice);
            var revenuesThisMonth = orders.Where(x => x.OrderDate.Month == DateTime.Now.Month).Sum(x => x.TotalPrice);

            return new()
            {
                Count = (double)orders.Sum(x => x.TotalPrice), 
                Extra = (double)(revenuesThisMonth - revenuesLastMonth),
                Percentage = revenuesLastMonth > 0 ? (double)((revenuesThisMonth - revenuesLastMonth) / revenuesLastMonth) * 100 : 0
            };
        }

        public List<decimal> MonthlyRevenues()
        {
            List<decimal> monthlyRevenues = [];

            var orders = db.Order.ToList();
            for (int month = 1; month <= 12; month++)
            {
                var revenue = orders.Where(x => x.OrderDate.Month == month).Sum(x => x.TotalPrice);
                monthlyRevenues.Add(revenue);
            }
            return monthlyRevenues;
        }
    }
}

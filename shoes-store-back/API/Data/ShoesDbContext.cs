using API.Models;
using Microsoft.EntityFrameworkCore;

#pragma warning disable
namespace API.Data
{
    public class ShoesDbContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server=localhost;Initial Catalog=ShoeStore;Integrated Security=True;Encrypt=True;Trust Server Certificate=True");
        }

        public DbSet<Account> Account { get; set; }
        public DbSet<BlacklistComment> BlacklistComment { get; set; }
        public DbSet<Cart> Cart { get; set; }
        public DbSet<CartItem> CartItem { get; set; }
        public DbSet<Comment> Comment { get; set; }
        public DbSet<Contact> Contact { get; set; }
        public DbSet<Export> Export { get; set; }
        public DbSet<Import> Import { get; set; }
        public DbSet<Notification> Notification { get; set; }
        public DbSet<Order> Order { get; set; }
        public DbSet<OrderDetail> OrderDetail { get; set; }
        public DbSet<Product> Product { get; set; }
        public DbSet<ProductVariant> ProductVariant { get; set; }
    }
}

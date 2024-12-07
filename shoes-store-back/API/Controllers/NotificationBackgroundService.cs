
using API.Data;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class NotificationBackgroundService(IServiceScopeFactory scopeFactory) : IHostedService, IDisposable
    {
        private Timer? _timer = null;
        private readonly IServiceScopeFactory _scopeFactory = scopeFactory;

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _timer = new Timer(NotifyInactiveVariant, null, TimeSpan.Zero, TimeSpan.FromDays(30));
            return Task.CompletedTask;
        }

        private void NotifyInactiveVariant(object? state)
        {
            // Get scoped service from Dependency Injection
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ShoesDbContext>();

            // Proccess here
            var notifyDescription = "";

            var variants = db.ProductVariant
                .Include(v => v.Imports)
                .Include(v => v.Product)
                .Where(v => !v.IsStopSelling)
                .ToList();

            variants.ForEach(variant =>
            {
                var lastImport = variant.Imports.LastOrDefault();
                double totalDays = 0;
                if (variant.VariantQuantity <= 5 && (lastImport == null || (totalDays = (DateTime.Now - lastImport.ImportDate).TotalDays) >= 30))
                {
                    if (lastImport != null)
                    {
                        notifyDescription += $"· (#{variant.Product!.ProductID}) {variant.Product.ProductName} (Size: {variant.VariantSize} / {variant.VariantColor}) is almost out of stock and hasn't been import for {totalDays:N0} days.\n";
                    }
                    else
                    {
                        notifyDescription += $"· (#{variant.Product!.ProductID}) {variant.Product.ProductName} (Size: {variant.VariantSize} / {variant.VariantColor}) hasn't never been import.\n";
                    }
                }
            });

            if (!string.IsNullOrEmpty(notifyDescription))
            {
                var staffs = db.Account.Where(a => a.Role == "Staff");
                foreach (var staff in staffs)
                {
                    var notification = new Notification
                    {
                        AccountID = staff.AccountID,
                        Title = $"Import product for upcoming order",
                        Description = notifyDescription,
                    };

                    db.Notification.Add(notification);
                }
                db.SaveChanges();
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose() => _timer?.Dispose();
    }
}

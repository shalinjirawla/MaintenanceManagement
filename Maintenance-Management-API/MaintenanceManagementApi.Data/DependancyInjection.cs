using MaintenanceManagementApi.Data.IRepository;
using MaintenanceManagementApi.Data.Repository;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data
{
    public static class DependancyInjection
    {
        public static IServiceCollection RegisterRepository(this IServiceCollection repository)
        {
            repository.AddScoped<IAuthRepository, AuthRepository>();
            repository.AddScoped<IUserRepository, UserRepository>();
            repository.AddScoped<IRequestRepository, RequestRepository>();
            repository.AddScoped<IWorkOrderRepository, WorkOrderRepository>();
            repository.AddScoped<IAssetRepository, AssetRepository>();
            repository.AddScoped<IPreventiveMaintenanceRepository, PreventiveMaintenanceRepository>();
            repository.AddScoped<ILocationRepository, LocationRepository>();
            repository.AddScoped<INotificationRepository, NotificationRepository>();
            repository.AddScoped<IPaymentRepository, PaymentRepository>();
            repository.AddScoped<IVendorRepository, VendorRepository>();
            repository.AddScoped<IInventoryRepository, InventoryRepository>();
            repository.AddScoped<IPurchaseOrderRepository, PurchaseOrderRepository>();
            return repository;
        }
    }
}

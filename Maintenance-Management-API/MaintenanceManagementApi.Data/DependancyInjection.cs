using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
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

            repository.AddScoped<IGenericRepository<Location>, GenericRepository<Location>>();
            repository.AddScoped<IGenericRepository<Asset>, GenericRepository<Asset>>();            
            repository.AddScoped<IGenericRepository<InventoryCategory>, GenericRepository<InventoryCategory>>();
            repository.AddScoped<IGenericRepository<Vendor>, GenericRepository<Vendor>>();
            repository.AddScoped<IGenericRepository<WorkOrderDto>, GenericRepository<WorkOrderDto>>();
            repository.AddScoped<IGenericRepository<PreventiveMaintenanceDto>, GenericRepository<PreventiveMaintenanceDto>>();
            repository.AddScoped<IGenericRepository<WorkRequestWithStatus>, GenericRepository<WorkRequestWithStatus>>();
            repository.AddScoped<IGenericRepository<InventoryItem>, GenericRepository<InventoryItem>>();
            repository.AddScoped<IGenericRepository<PurchaseOrderListDto>, GenericRepository<PurchaseOrderListDto>>();
            repository.AddScoped<IGenericRepository<Payment>, GenericRepository<Payment>>();
            repository.AddScoped<IGenericRepository<UserDto>, GenericRepository<UserDto>>();
            return repository;
        }
    }
}

using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Bussiness.Service;
using MaintenanceManagementApi.Data.IRepository;
using MaintenanceManagementApi.Data.Repository;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness
{
    public static class DependancyInjection
    {
        public static IServiceCollection RegisterService(this IServiceCollection Service)
        {
            Service.AddScoped<IAuthService, AuthService>();
            Service.AddScoped<IUserService, UserService>();
            Service.AddScoped<IRequestService, RequestService>();
            Service.AddScoped<IWorkOrderService, WorkOrderService>();
            Service.AddScoped<IAssetService, AssetService>();
            Service.AddScoped<IPreventiveMaintenanceService, PreventiveMaintenanceService>();
            Service.AddScoped<ILocationService, LocationService>();
            Service.AddScoped<INotificationService, NotificationService>();
            Service.AddScoped<IPaymentService, PaymentService>();
            Service.AddScoped<IVendorService, VendorService>();
            Service.AddScoped<IInventoryService, InventoryService>();
            Service.AddScoped<IPurchaseOrderService, PurchaseOrderService>();


            return Service;

        }
    }
}

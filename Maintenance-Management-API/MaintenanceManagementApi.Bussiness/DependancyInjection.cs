using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Bussiness.Service;
using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Data.IRepository;
using MaintenanceManagementApi.Data.Repository;
using Microsoft.AspNetCore.Hosting;
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

            Service.AddScoped<IGenericFilterService<LocationDto>, GenericFilterService<Location, LocationDto>>();
            Service.AddScoped<IGenericFilterService<AssetDto>, GenericFilterService<Asset, AssetDto>>();            
            Service.AddScoped<IGenericFilterService<InventoryCategoryDto>, GenericFilterService<InventoryCategory, InventoryCategoryDto>>();
            Service.AddScoped<IGenericFilterService<VendorDto>, GenericFilterService<Vendor, VendorDto>>();
            Service.AddScoped<IGenericFilterService<WorkOrderDto>, GenericFilterService<WorkOrderDto, WorkOrderDto>>();
            Service.AddScoped<IGenericFilterService<PreventiveMaintenanceDto>, GenericFilterService<PreventiveMaintenanceDto, PreventiveMaintenanceDto>>();
            Service.AddScoped<IGenericFilterService<WorkRequestWithStatusDto>, GenericFilterService<WorkRequestWithStatus, WorkRequestWithStatusDto>>();
            Service.AddScoped<IGenericFilterService<InventoryItemDto>, GenericFilterService<InventoryItem, InventoryItemDto>>();
            Service.AddScoped<IGenericFilterService<PurchaseOrderListDto>, GenericFilterService<PurchaseOrderListDto, PurchaseOrderListDto>>();
            Service.AddScoped<IGenericFilterService<PaymentDto>, GenericFilterService<Payment, PaymentDto>>();
            Service.AddScoped<IGenericFilterService<UserDto>, GenericFilterService<UserDto, UserDto>>();

            return Service;
        }

    }
}

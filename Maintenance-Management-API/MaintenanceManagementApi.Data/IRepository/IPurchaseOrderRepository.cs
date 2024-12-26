using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.IRepository
{
    public interface IPurchaseOrderRepository
    {
        // Add New Purchase Order
        Task<int> InsertPurchaseOrder(PurchaseOrder po);
        
        // Add New Purchase Order Item
        Task<int> InsertPurchaseOrderItems(PurchaseOrderItem item);

        //Get Purchase Order List By Admin
        Task<List<PurchaseOrderListDto>> GetPurchaseOrderList(int id);

        //Get Purchase Order List By Id
        Task<PurchaseOrderDto> GetPurchaseOrderById(int id);

        //Delete Purchase Order 
        Task<bool> DeletePurchaseOrder(List<int> ids);

        //Update Status Purchase Order
        Task<bool> UpdatePurchaseOrderStatus(int id, string status);
    }
}

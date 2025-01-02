using MaintenanceManagementApi.Common.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.IService
{
    public interface IPurchaseOrderService
    {
        // Add New Purchase Order
        Task<int> InsertPurchaseOrder(PurchaseOrderDto po);

        //Get Purchase Order List By Admin
        Task<List<PurchaseOrderListDto>> GetPurchaseOrderList(int id);

        //Get Purchase Order List By Id
        Task<PurchaseOrderDto> GetPurchaseOrderById(int id);

        //Delete Purchase Order 
        Task<bool> DeletePurchaseOrder(List<int> ids);

        //Update Status Purchase Order
        Task<bool> UpdatePurchaseOrderStatus(int id, string status);

        //Check Exist PO number
        Task<bool> CheckExist(string ponumber, int id, int uid);
    }
}

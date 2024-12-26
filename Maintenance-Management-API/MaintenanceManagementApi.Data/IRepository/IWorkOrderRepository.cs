using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.IRepository
{
    public interface IWorkOrderRepository
    {
        // Add new Work Order
        Task<int> Insert(WorkOrder workorder);

        //Delete work order
        Task<bool> Delete(List<int> id);

        //Get All WorkOrder
        Task<List<WorkOrderDto>> GetAll();

        // Get WorkOrder By Role
        Task<List<WorkOrderDto>> GetWorkOrderByRoleId(int id, string role);

        //Update WorkOrder Status
        Task<int> UpdateStatus(WorkOrder workorder);

        //Update WorkOrder 
        Task<int> Update(WorkOrder workorder);

        //Advance Filter Workorder
        Task<IEnumerable<WorkOrder>> GetFilteredWorkOrders(FilterDto filter);

        // Complate workorder
        Task<int> Insertcomplateworkorder(CompletedWorkOrder completedWorkOrder);

        // Maintenance Items used
        Task<int> InsertMaintananceItems(MaintenanceItem maintenanceItemDto);

        // review workorder
        Task<CompletedWorkOrder> GetReviewdata(int id);

        // get previous assign workorder employee
        Task<int> GetPreviousassignemployee(int id);

        //Get workorder count
        Task<DashbordCountsDto> Getworkordercount(int id);

        //Get workorder Payment complete
        Task<DashbordCountsDto> Getpaymentcount(int id);
    }
}

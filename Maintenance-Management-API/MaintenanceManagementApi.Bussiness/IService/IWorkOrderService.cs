using MaintenanceManagementApi.Common.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.IService
{
    public interface IWorkOrderService
    {
        // Add new Workorder
        Task<int> Insert(WorkOrderDto workorderdto);

        //Delete work order
        Task<bool> DeleteWorkOrderById(List<int> id);

        //Get All WorkOrder
        Task<List<WorkOrderDto>> GetAll();

        // Get WorkOrder By Role
        Task<List<WorkOrderDto>> GetWorkOrderByRoleId(int id, string role);

        //Update WorkOrder Status
        Task<int> UpdateStatus(WorkOrderDto workorderdto);

        //Update WorkOrder 
        Task<int> UpdateWorkOrder(WorkOrderDto workorderdto);

        // Complate workorder
        Task<int> InsertCompleteworkorder(CompletedWorkOrderDto completedWorkOrderDto);

        // review workorder
        Task<CompletedWorkOrderDto> GetReviewdata(int id);

        // get previous assign workorder employee
        Task<int> GetPreviousassignemployee(int id);

        //Get workorder count
        Task<DashbordCountsDto> Getworkordercount(int id);

        //Get workorder Payment complete
        Task<DashbordCountsDto> Getpaymentcount(int id);

    }
}

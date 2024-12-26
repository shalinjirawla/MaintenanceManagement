using AutoMapper;
using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Data.IRepository;
using MaintenanceManagementApi.Data.Repository;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.Service
{
    public class WorkOrderService : IWorkOrderService
    {
        private readonly IWorkOrderRepository _workOrderRepository;
        private readonly IMapper _mapper;

        public WorkOrderService(IWorkOrderRepository workOrderRepository, IMapper mapper)
        {
            _workOrderRepository = workOrderRepository;
            _mapper = mapper;

        }

        //Add New Work Order
        public async Task<int> Insert(WorkOrderDto workorderdto)
        {
            var data = _mapper.Map<WorkOrder>(workorderdto);
            //  data.Password = BCrypt.Net.BCrypt.HashPassword(requestDto.Password);
            await _workOrderRepository.Insert(data);
            return data.Id;
        }

        //Delete work order
        public async Task<bool> DeleteWorkOrderById(List<int> id)
        {
            return await _workOrderRepository.Delete(id);
        }

        //Get All WorkOrder
        public async Task<List<WorkOrderDto>> GetAll()
        {
            var data = await _workOrderRepository.GetAll();
            return data;
        }

        // Get WorkOrder By Role
        public async Task<List<WorkOrderDto>> GetWorkOrderByRoleId(int id, string role)
        {
            var result = await _workOrderRepository.GetWorkOrderByRoleId(id, role);
            // return _mapper.Map<List<WorkOrderDto>>(result);
            return result;
        }

        //Update WorkOrder Status
        public async Task<int> UpdateStatus(WorkOrderDto workorderdto)
        {
            var data = _mapper.Map<WorkOrder>(workorderdto);
            var result = await _workOrderRepository.UpdateStatus(data);
            return result;
        }

        //Update WorkOrder 
        public async Task<int> UpdateWorkOrder(WorkOrderDto workorderdto)
        {
            var data = _mapper.Map<WorkOrder>(workorderdto);
            var result = await _workOrderRepository.Update(data);
            return result;
        }

        //Advance Filter Workorder
        public async Task<IEnumerable<WorkOrderDto>> GetFilteredWorkOrders(FilterDto filter)
        {
            var data = await _workOrderRepository.GetFilteredWorkOrders(filter);
            return _mapper.Map<IEnumerable<WorkOrderDto>>(data);
        }

        // Complate workorder
        public async Task<int> InsertCompleteworkorder(CompletedWorkOrderDto completedWorkOrderDto)
        {
            var data = _mapper.Map<CompletedWorkOrder>(completedWorkOrderDto);
            var result = await _workOrderRepository.Insertcomplateworkorder(data);
            if (result != null)
            {
                var workOrder = new WorkOrder();
                workOrder.Id = completedWorkOrderDto.WorkOrderID;
                workOrder.Status = completedWorkOrderDto.Status;
                await _workOrderRepository.UpdateStatus(workOrder);
            }
            if (completedWorkOrderDto.Status == "Complete")
            {

                foreach (var item in completedWorkOrderDto.MaintenanceItem)
                {
                    item.CompletedWorkOrderId = result; // Assign the generated PurchaseOrderId
                    var maintananceItemEntity = _mapper.Map<MaintenanceItem>(item); // Map the DTO to entity

                    // Insert each PurchaseOrderItem into the database
                    await _workOrderRepository.InsertMaintananceItems(maintananceItemEntity);
                }
            }

            return completedWorkOrderDto.Id;
        }

        // review workorder
        public async Task<CompletedWorkOrderDto> GetReviewdata(int id)
        {
            var data = await _workOrderRepository.GetReviewdata(id);
            return _mapper.Map<CompletedWorkOrderDto>(data);
        }

        // get previous assign workorder employee
        public async Task<int> GetPreviousassignemployee(int id)
        {
            return await _workOrderRepository.GetPreviousassignemployee(id);
        }

        //Get workorder count
        public async Task<DashbordCountsDto> Getworkordercount(int id)
        {
            return await _workOrderRepository.Getworkordercount(id);
        }

        //Get workorder Payment complete
        public async Task<DashbordCountsDto> Getpaymentcount(int id)
        {
            return await _workOrderRepository.Getpaymentcount(id);
        }
    }
}

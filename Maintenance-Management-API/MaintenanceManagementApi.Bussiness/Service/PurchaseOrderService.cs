using AutoMapper;
using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Data.IRepository;
using MaintenanceManagementApi.Data.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.Service
{
    public class PurchaseOrderService:IPurchaseOrderService
    {
        private readonly IPurchaseOrderRepository _purchaseOrderRepository;
        private readonly IMapper _mapper;

        public PurchaseOrderService(IPurchaseOrderRepository purchaseOrderRepository, IMapper mapper)
        {
            _purchaseOrderRepository = purchaseOrderRepository;
            _mapper = mapper;
        }

        // Add New Purchase Order
        public async Task<int> InsertPurchaseOrder(PurchaseOrderDto po)
        {
            var data = _mapper.Map<PurchaseOrder>(po);
            var purchaseOrderId = await _purchaseOrderRepository.InsertPurchaseOrder(data);
            await _purchaseOrderRepository.RemovePreviousItem(purchaseOrderId);
            if (purchaseOrderId>0) {
                foreach (var item in po.PurchaseOrderItems)
                {
                    item.PurchaseOrderId = purchaseOrderId; // Assign the generated PurchaseOrderId
                    var purchaseOrderItemEntity = _mapper.Map<PurchaseOrderItem>(item); // Map the DTO to entity

                    // Insert each PurchaseOrderItem into the database
                    await _purchaseOrderRepository.InsertPurchaseOrderItems(purchaseOrderItemEntity);
                }
            }

            return purchaseOrderId;

        }

        //Get Purchase Order List By Admin
        public async Task<List<PurchaseOrderListDto>> GetPurchaseOrderList(int id)
        {
            return await _purchaseOrderRepository.GetPurchaseOrderList(id);
           
        }

        //Get Purchase Order List By Id
        public async Task<PurchaseOrderDto> GetPurchaseOrderById(int id)
        {
            var data = await _purchaseOrderRepository.GetPurchaseOrderById(id);
            return data;
        }

        //Delete Purchase Order 
        public async Task<bool> DeletePurchaseOrder(List<int> ids)
        {
            var result = await _purchaseOrderRepository.DeletePurchaseOrder(ids);
            return result;
        }

        //Update Status Purchase Order
        public async Task<bool> UpdatePurchaseOrderStatus(int id, string status)
        {
            return await _purchaseOrderRepository.UpdatePurchaseOrderStatus(id,status);
        }

        //Check Exist PO number
        public async Task<bool> CheckExist(string ponumber, int id, int uid)
        {
            return await _purchaseOrderRepository.CheckExist(ponumber, id, uid);
        }
    }
}


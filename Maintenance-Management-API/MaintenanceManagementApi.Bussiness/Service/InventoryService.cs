using AutoMapper;
using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Data.IRepository;
using MaintenanceManagementApi.Data.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.Service
{
    public class InventoryService:IInventoryService
    {
        private readonly IInventoryRepository _inventoryRepository;
        private readonly IMapper _mapper;

        public InventoryService(IInventoryRepository inventoryRepository,IMapper mapper)
        {
            _inventoryRepository = inventoryRepository;
            _mapper = mapper;
        }

        // Add New Inventory Category
        public async Task<int> Insert(InventoryCategoryDto inventory)
        {
            var data = _mapper.Map<InventoryCategory>(inventory);
            return await _inventoryRepository.Insert(data);
        }

        // Get Inventory Category  by Admin
        public async Task<List<InventoryCategoryDto>> GetInventoryCategory(int id)
        {
            var data = await _inventoryRepository.GetInventorycategory(id);
            return _mapper.Map<List<InventoryCategoryDto>>(data);
        }

        //Delete Inventory Category
        public async Task<bool> DeleteInventoryCategory(List<int> ids)
        {
            var result = await _inventoryRepository.DeleteInventorycategory(ids);
            return result;
        }


        // Add New Inventory Items  
        public async Task<int> InsertItem(InventoryItemDto inventoryItem)
        {
            var data = _mapper.Map<InventoryItem>(inventoryItem);
            return await _inventoryRepository.InsertItem(data);
        }

        // Get Inventory Items by Admin
        public async Task<List<InventoryItemDto>> GetInventoryItems(int id)
        {
            var data = await _inventoryRepository.GetInventoryItems(id);
            return data;
        }


        //Delete Inventory Items
        public async Task<bool> DeleteInventoryItems(List<int> ids)
        {
            var result = await _inventoryRepository.DeleteInventoryItems(ids);
            return result;
        }

        public async Task<bool> UpdateQuantity(List<InventoryQuantityDto> payload)
            {
            foreach (var item in payload)
            {
                var result = await _inventoryRepository.UpdateQuantity(item);
            }
            return true;
        }

        // Get Inventory by Admin
        public async Task<List<InventoryDto>> GetInventory(int id)
        {
            var data = await _inventoryRepository.GetInventory(id);
            return data;
        }

        //Advance Filter Inventory Item
        public async Task<List<InventoryItemDto>> GetInventoryitems(FilterDto filter)
        {
            var data = await _inventoryRepository.GetFilteredItems(filter);
            var itemdata = _mapper.Map<List<InventoryItemDto>>(data);
            return itemdata;
        }

        //Advance Filter Inventory Item category 
        public async Task<List<InventoryCategoryDto>> GetInventorycategory(FilterDto filter)
        {
            var data = await _inventoryRepository.GetInventorycategory(filter);
            var itemdata = _mapper.Map<List<InventoryCategoryDto>>(data);
            return itemdata;

        }

        //Get inventory item count for dashboard
        public async Task<List<DashbordCountsDto>> GetInventorycount(int id)
        {
            return await _inventoryRepository.GetInventorycount(id);
        }
    }
}

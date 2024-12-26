using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.IRepository
{
    public interface IInventoryRepository
    {
        // Add New Inventory Category
        Task<int> Insert(InventoryCategory inventory);

        // Get Inventory Category  by Admin
        Task<List<InventoryCategory>> GetInventorycategory(int id);

        //Delete Inventory Category
        Task<bool> DeleteInventorycategory(List<int> ids);

        // Add New Inventory Items 
        Task<int> InsertItem(InventoryItem inventory);

        // Get Inventory Items  by Admin
        Task<List<InventoryItemDto>> GetInventoryItems(int id);

        //Delete Inventory Items
        Task<bool> DeleteInventoryItems(List<int> ids);

        Task<bool> UpdateQuantity(InventoryQuantityDto payload);

        // Get Inventory  by Admin
        Task<List<InventoryDto>> GetInventory(int id);

        //Advance Filter Inventory Item 
        Task<List<InventoryItem>> GetFilteredItems(FilterDto filter);

        //Advance Filter Inventory Item category 
        Task<List<InventoryCategory>> GetInventorycategory(FilterDto filter);

        //Get inventory item count for dashboard
        Task<List<DashbordCountsDto>> GetInventorycount(int id);

    }
}

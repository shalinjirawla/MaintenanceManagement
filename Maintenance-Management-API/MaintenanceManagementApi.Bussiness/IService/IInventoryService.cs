using MaintenanceManagementApi.Common.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.IService
{
    public interface IInventoryService
    {
        // Add New Inventory Category
        Task<int> Insert(InventoryCategoryDto inventory);

        // Get Inventory Category  by Admin
        Task<List<InventoryCategoryDto>> GetInventoryCategory(int id);

        //Delete Inventory Category
        Task<bool> DeleteInventoryCategory(List<int> ids);

        // Add New Inventory Items  
        Task<int> InsertItem(InventoryItemDto inventoryItem);

        // Get Inventory Items by Admin
        Task<List<InventoryItemDto>> GetInventoryItems(int id);

        //Delete Inventory Items
        Task<bool> DeleteInventoryItems(List<int> ids);

        // Update Quantity of the inventory
        Task<bool> UpdateQuantity(List<InventoryQuantityDto> payload);

        // Get Inventory by Admin
        Task<List<InventoryDto>> GetInventory(int id);

        //Advance Filter Inventory Item
        Task<List<InventoryItemDto>> GetInventoryitems(FilterDto filter);

        //Advance Filter Inventory Item category 
        Task<List<InventoryCategoryDto>> GetInventorycategory(FilterDto filter);

        //Get inventory item count for dashboard
        Task<List<DashbordCountsDto>> GetInventorycount(int id);
    }
}

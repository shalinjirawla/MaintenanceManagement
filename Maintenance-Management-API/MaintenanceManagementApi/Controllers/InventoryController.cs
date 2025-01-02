using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Bussiness.Service;
using MaintenanceManagementApi.Common.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static MaintenanceManagementApi.Controllers.PurchaseOrderController;

namespace MaintenanceManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;
        private readonly IGenericFilterService<InventoryCategoryDto> _iGenericFilterService;
        private readonly IGenericFilterService<InventoryItemDto> _iGenericFiltersService;

        public InventoryController(IInventoryService inventoryService, IGenericFilterService<InventoryCategoryDto> iGenericFilterService, IGenericFilterService<InventoryItemDto> iGenericFiltersService)
        {
            _inventoryService = inventoryService;
            _iGenericFilterService = iGenericFilterService;
            _iGenericFiltersService = iGenericFiltersService;
        }
        // Add New Inventory Category  
        [HttpPost]
        public async Task<IActionResult> Insert(InventoryCategoryDto inventory)
        {
            var user = await _inventoryService.Insert(inventory);
            if (user == null)
            {
                return BadRequest("Failed to add category");
            }
            return Ok(user);
        }

        // Get Inventory Category  by Admin
        [HttpGet("getinventorycategory/{id}")]
        public async Task<IActionResult> GetInventoryCategory(int id)
        {
            var data = await _inventoryService.GetInventoryCategory(id); // Change this method accordingly
            return Ok(data);
        }

        //Delete Inventory Category 
        [HttpDelete("deleteinventorycategory")]
        public async Task<IActionResult> DeleteInventoryCategory([FromBody] List<int> ids)
        {
            if (ids == null || !ids.Any())
            {
                return BadRequest("No IDs provided.");
            }

            var count = await _inventoryService.DeleteInventoryCategory(ids);

            return Ok(count);
        }

        // Add New Inventory Items  
        [HttpPost("additems")]
        public async Task<IActionResult> InsertItem(InventoryItemDto inventory)
        {
            var user = await _inventoryService.InsertItem(inventory);
            if (user == null)
            {
                return BadRequest("Failed to add Item");
            }
            return Ok(user);

        }

        // Get Inventory Items  by Admin
        [HttpGet("getinventoryitems/{id}")]
        public async Task<IActionResult> GetInventoryItems(int id)
        {
            var data = await _inventoryService.GetInventoryItems(id); // Change this method accordingly
            return Ok(data);
        }

        //Delete Inventory Items 
        [HttpDelete("deleteinventoryItems")]
        public async Task<IActionResult> DeleteInventoryItems([FromBody] List<int> ids)
        {
            if (ids == null || !ids.Any())
            {
                return BadRequest("No IDs provided.");
            }

            var count = await _inventoryService.DeleteInventoryItems(ids);

            return Ok(count);
        }

        // Update Quantity of the inventory
        [HttpPut("updatequantity")]
        public async Task<IActionResult> UpdateQuantity([FromBody] List<InventoryQuantityDto> payload)
        {
            if (payload == null || !payload.Any())
            {
                return BadRequest("Invalid data");
            }

            // Call the service to process the data
            var result = await _inventoryService.UpdateQuantity(payload);

            if (!result)
            {
                return BadRequest("Update failed");
            }

            return Ok(new { message = "Status updated successfully" });
        }

        // Get Inventory by Admin
        [HttpGet("getinventory/{id}")]
        public async Task<IActionResult> GetInventory(int id)
        {
            var data = await _inventoryService.GetInventory(id); // Change this method accordingly
            return Ok(data);
        }

        //Advance Filter Inventory Item 
        [HttpGet("FilterInventory")]
        public async Task<ActionResult<IEnumerable<InventoryItemDto>>> FilterInventory([FromQuery] FilterDto filter)
        {
            var items = await _iGenericFiltersService.GetFilteredData(filter);
            return Ok(items);
        }
        //Advance Filter Inventory Item category 
        [HttpGet("FilterCategory")]
        public async Task<ActionResult<IEnumerable<InventoryCategoryDto>>> FilterCategory([FromQuery] FilterDto filter)
        {
            var category = await _iGenericFilterService.GetFilteredData(filter);
            return Ok(category);
        }

        //Get inventory item count for dashboard
        [HttpGet("inventorycount/{id}")]
        public async Task<ActionResult<IEnumerable<DashbordCountsDto>>> GetInventorycount(int id)
        {
            var data = await _inventoryService.GetInventorycount(id);
            return Ok(data);
        }

        //Check Exist Category
        [HttpGet("exists")]
        public async Task<bool> CheckCategoryExists(string category, int adminid, int id)
        {
            var result = await _inventoryService.CheckExist(category, adminid, id);
            return result;
        }
    }
}

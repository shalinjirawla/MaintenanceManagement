using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DataDbContext;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Data.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace MaintenanceManagementApi.Data.Repository
{
    public class InventoryRepository : IInventoryRepository
    {
        private readonly AppDbContext _context;

        public InventoryRepository(AppDbContext context)
        {
            _context = context;
        }

        // Add New Inventory Category
        public async Task<int> Insert(InventoryCategory inventory)
        {
            if (inventory == null)
            {
                return 0;
            }
            if (inventory.Id == 0)
            {
                await _context.InventoryCategorys.AddAsync(inventory);
                await _context.SaveChangesAsync();
                return 1;
            }
            else
            {
                _context.InventoryCategorys.Update(inventory);
                await _context.SaveChangesAsync();
                return 0;
            }
        }

        // Get Inventory Category  by Admin
        public async Task<List<InventoryCategory>> GetInventorycategory(int id)
        {
            return await _context.InventoryCategorys.Where(w => w.HadAdminId == id).ToListAsync();
        }

        //Delete Inventory Category
        public async Task<bool> DeleteInventorycategory(List<int> ids)
        {
            var category = await _context.InventoryCategorys
                                .Where(v => ids.Contains(v.Id))
                                .ToListAsync();

            if (!category.Any())
            {
                return false; // No vendors found to delete
            }

            _context.InventoryCategorys.RemoveRange(category);
            await _context.SaveChangesAsync();
            return true;
        }

        // Add New Inventory Items 
        public async Task<int> InsertItem(InventoryItem inventory)
        {

            if (inventory == null)
            {
                return 0;
            }
            if (inventory.Id == 0)
            {
                await _context.InventoryItems.AddAsync(inventory);
                await _context.SaveChangesAsync();
                return inventory.Id;
            }
            else
            {
                _context.InventoryItems.Update(inventory);
                await _context.SaveChangesAsync();
                return 0;
            }
        }

        // Get Inventory Items  by Admin
        public async Task<List<InventoryItemDto>> GetInventoryItems(int id)
        {
            var data = await _context.InventoryItems
                .Where(w => w.HadAdminId == id)
                .Include(item => item.InventoryCategory)
                .Select(item => new InventoryItemDto
                {
                    Id = item.Id,
                    Name = item.Name,
                    Description = item.Description,
                    IsActive = item.IsActive,
                    SKU = item.SKU,
                    Unit = item.Unit,
                    Status = item.Status,
                    AvailableQuantity = item.AvailableQuantity,
                    Location = item.Location,
                    InventoryCategoryId = item.InventoryCategoryId,
                    InventoryCategory = item.InventoryCategory == null ? null : new InventoryCategoryDto
                    {
                        Id = item.InventoryCategory.Id,
                        CategoryName = item.InventoryCategory.CategoryName
                    }
                })
                .ToListAsync();
            return data;
        }

        //Delete Inventory Items
        public async Task<bool> DeleteInventoryItems(List<int> ids)
        {
            var item = await _context.InventoryItems
                                .Where(v => ids.Contains(v.Id))
                                .ToListAsync();

            if (!item.Any())
            {
                return false; // No vendors found to delete
            }

            _context.InventoryItems.RemoveRange(item);
            await _context.SaveChangesAsync();
            return true;
        }

        //Inventory Quantity Update 
        public async Task<bool> UpdateQuantity(InventoryQuantityDto payload)
        {
            var inventoryItem = await _context.InventoryItems.FirstOrDefaultAsync(i => i.Id == payload.Id);
            var orderItem = await _context.PurchaseOrderItems.FirstOrDefaultAsync(i => i.Id == payload.Poitemid);
            if (inventoryItem != null)
            {
                
                if (inventoryItem.Price == null && inventoryItem.Taxes == null)
                {
                    // If Price is null, set it to the cost (first-time entry)
                    inventoryItem.Price = orderItem.Cost;
                    inventoryItem.Taxes = orderItem.Taxes;
                    inventoryItem.Status = "In stock";
                    inventoryItem.AvailableQuantity = orderItem.Quantity;
                    inventoryItem.OnHandQuantity = orderItem.Quantity;
                }
                else
                {
                    // If Price is not null, adjust it by adding the cost divided by AvailableQuantity
                    // Adjust price if it already has a value
                    var totalAmount = (inventoryItem.AvailableQuantity * inventoryItem.Price) + (orderItem.Quantity * orderItem.Cost);
                    var totalQuantity = inventoryItem.AvailableQuantity + orderItem.Quantity;
                    inventoryItem.Price = totalAmount / totalQuantity;

                    inventoryItem.Taxes = orderItem.Taxes;
                    inventoryItem.AvailableQuantity += orderItem.Quantity;
                    inventoryItem.OnHandQuantity += orderItem.Quantity;
                }
            }
            else
            {
                // Item not found, log error or return false
                return false; // Item not found in inventory
            }
            await _context.SaveChangesAsync();
            return true; // All updates successful
        }

        // Get Inventory by Admin
        public async Task<List<InventoryDto>> GetInventory(int id)
        {
            var data = await (from item in _context.InventoryItems
                              join category in _context.InventoryCategorys
                              on item.InventoryCategoryId equals category.Id
                              where item.HadAdminId == id && item.OnHandQuantity != null
                              select new InventoryDto
                              {
                                  Id = item.Id,
                                  Name = item.Name,
                                  AvailableQuantity = item.AvailableQuantity,
                                  AllocatedQuantity = item.AllocatedQuantity,
                                  OnHandQuantity = item.OnHandQuantity,
                                  Price = item.Price,
                                  Taxes = item.Taxes,
                                  InventoryCategori = category.CategoryName, // Include category name
                                  Location = item.Location,
                                  Unit = item.Unit,
                                  Status = item.Status,
                              }).ToListAsync();

            return data;
        }


        //Get inventory item count for dashboard
        public async Task<List<DashbordCountsDto>> GetInventorycount(int id)
        {
            var data = await (from item in _context.InventoryItems
                              join po in _context.PurchaseOrderItems on item.Id equals po.InventoryItemId
                              where item.HadAdminId == id
                              group po by new { item.Id, item.Name, item.OnHandQuantity } into grouped
                              select new DashbordCountsDto
                              {
                                  Name = grouped.Key.Name,
                                  CountingCount = grouped.Key.OnHandQuantity,
                                  TotalCount = grouped.Sum(x => x.Quantity) // Aggregate the Quantity
                              }).ToListAsync();

            return data;
        }

        //Check Exist Category
        public async Task<bool> CheckExist(string category, int adminid, int id)
        {
            if (id == 0)
            {
                return await _context.InventoryCategorys.AnyAsync(u => u.CategoryName == category && u.HadAdminId == adminid);
            }
            else
            {
                return await _context.InventoryCategorys.AnyAsync(u =>
                    u.CategoryName == category &&
                    u.HadAdminId == adminid &&
                    u.Id != id
                );
            }
        }

    }
}

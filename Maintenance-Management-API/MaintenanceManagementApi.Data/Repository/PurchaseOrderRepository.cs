using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DataDbContext;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Data.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.Repository
{
    public class PurchaseOrderRepository : IPurchaseOrderRepository
    {
        private readonly AppDbContext _context;

        public PurchaseOrderRepository(AppDbContext context)
        {
            _context = context;
        }

        // Add New Purchase Order
        public async Task<int> InsertPurchaseOrder(PurchaseOrder po)
        {
            if (po.Id == 0)
            {
                bool uponumberExists = await _context.PurchaseOrders
            .AnyAsync(u => u.OrderNumber == po.OrderNumber && u.CreatedBy == po.CreatedBy);

                if (uponumberExists)
                {
                    return 0; // Indicates that the user already exists
                }

                _context.PurchaseOrders.AddAsync(po);
                await _context.SaveChangesAsync();
                return po.Id;
            }
            else
            {
                var uponumberExists = await _context.PurchaseOrders.FindAsync(po.Id);
                if (uponumberExists != null)
                {
                    bool usernameTaken = await _context.PurchaseOrders
              .AnyAsync(u => u.OrderNumber == po.OrderNumber && u.CreatedBy == po.CreatedBy && u.Id != po.Id);


                    if (usernameTaken)
                    {
                        return 0; // Username is already taken by another user
                    }

                    // Update fields
                    uponumberExists.Title = po.Title;
                    uponumberExists.OrderNumber = po.OrderNumber;
                    uponumberExists.VendorId = po.VendorId;
                    uponumberExists.OtherCost = po.OtherCost;
                    uponumberExists.TotalAmount = po.TotalAmount;
                    uponumberExists.ExpectedDeliveryDate = po.ExpectedDeliveryDate;
                    
                    _context.PurchaseOrders.Update(uponumberExists);
                    await _context.SaveChangesAsync();
                    return uponumberExists.Id;
                }

                return 0; // User not found
            }
        }

        //Remove
        public async Task<bool> RemovePreviousItem(int id)
        {
            // Check if any items exist for the given PurchaseOrderId
            var existingItems = await _context.PurchaseOrderItems
                .Where(u => u.PurchaseOrderId == id)
                .ToListAsync();

            if (existingItems.Any())
            {
                // Remove all existing items
                _context.PurchaseOrderItems.RemoveRange(existingItems);
            }
            return true;
        }

        // Add New Purchase Order Item
        public async Task<int> InsertPurchaseOrderItems(PurchaseOrderItem item)
        {
            
            _context.PurchaseOrderItems.Add(item);
            await _context.SaveChangesAsync();
            return item.Id;
        }

        //Get Purchase Order List By Admin
        public async Task<List<PurchaseOrderListDto>> GetPurchaseOrderList(int id)
        {
            var query = _context.PurchaseOrders.AsQueryable();
            if (id != 1) // Apply the condition only when id is not 1
            {
                query = query.Where(p => p.CreatedBy == id);
            }
            var data = await query
        .Select(p => new PurchaseOrderListDto
        {
            Id = p.Id,
            Title = p.Title,
            OrderNumber = p.OrderNumber,
            Items = _context.PurchaseOrderItems
                .Where(i => i.PurchaseOrderId == p.Id)
                .Count(), // Count the number of items
            Quantity = _context.PurchaseOrderItems
                .Where(i => i.PurchaseOrderId == p.Id)
                .Sum(i => i.Quantity), // Sum the quantity
            TotalAmount = p.TotalAmount,
            Vendorname = _context.Vendors
                .Where(v => v.Id == p.VendorId)
                .Select(v => v.Name)
                .FirstOrDefault(), // Get the vendor name
            DateCreated = p.DateCreated,
            Status = p.Status
        })
        .ToListAsync();

            return data;
        }

        //Get Purchase Order List By Id
        public async Task<PurchaseOrderDto> GetPurchaseOrderById(int id)
        {
            var data = await (from po in _context.PurchaseOrders
                              join v in _context.Vendors on po.VendorId equals v.Id
                              join poi in _context.PurchaseOrderItems on po.Id equals poi.PurchaseOrderId into items
                              where po.Id == id
                              select new
                              {
                                  po.Id,
                                  po.Title,
                                  po.OrderNumber,
                                  po.VendorId,
                                  VendorName = v.Name,
                                  po.OtherCost,
                                  po.TotalAmount,
                                  po.ExpectedDeliveryDate,
                                  po.ReceivedDate,
                                  po.DateCreated,
                                  po.CreatedBy,
                                  po.Status,
                                  PurchaseOrderItems = items.Select(i => new
                                  {
                                      i.Id,
                                      i.ItemName,
                                      i.Cost,
                                      i.Quantity,
                                      i.InventoryItemId,
                                      i.PurchaseOrderId,
                                      i.Taxes
                                  }).ToList()
                              }).FirstOrDefaultAsync();

            if (data == null)
            {
                return null;
            }

            // Map to DTO
            var result = new PurchaseOrderDto
            {
                Id = data.Id,
                Title = data.Title,
                OrderNumber = data.OrderNumber,
                VendorId = data.VendorId,
                Vendor = new VendorDto { Name = data.VendorName },
                OtherCost = data.OtherCost,
                TotalAmount = data.TotalAmount,
                ExpectedDeliveryDate = data.ExpectedDeliveryDate,
                ReceivedDate = data.ReceivedDate,
                DateCreated = data.DateCreated,
                CreatedBy = data.CreatedBy,
                Status = data.Status,
                PurchaseOrderItems = data.PurchaseOrderItems.Select(item => new PurchaseOrderItemDto
                {
                    Id = item.Id,
                    ItemName = item.ItemName,
                    Cost = item.Cost,
                    Quantity = item.Quantity,
                    InventoryItemId = item.InventoryItemId,
                    PurchaseOrderId = item.PurchaseOrderId,
                    Taxes=item.Taxes
                }).ToList()
            };

            return result;
        }

        //Delete Purchase Order 
        public async Task<bool> DeletePurchaseOrder(List<int> ids)
        {
            // Get related PurchaseOrderItems
            var items = await _context.PurchaseOrderItems
                            .Where(v => ids.Contains(v.PurchaseOrderId)) // Ensure PurchaseOrderId is nullable-safe
                            .ToListAsync();

            // Remove PurchaseOrderItems
            if (items.Any())
            {
                _context.PurchaseOrderItems.RemoveRange(items);
            }

            // Get related PurchaseOrders
            var purchaseOrders = await _context.PurchaseOrders
                                  .Where(p => ids.Contains(p.Id))
                                  .ToListAsync();

            // Remove PurchaseOrders
            if (purchaseOrders.Any())
            {
                _context.PurchaseOrders.RemoveRange(purchaseOrders);
            }
            else
            {
                return false; // No purchase orders found to delete
            }

            // Save changes
            await _context.SaveChangesAsync();
            return true;
        }

        //Update Status Purchase Order
        public async Task<bool> UpdatePurchaseOrderStatus(int id, string status)
        {
            // Find the purchase order by ID
            var purchaseOrder = await _context.PurchaseOrders.FirstOrDefaultAsync(p => p.Id == id);

            if (purchaseOrder == null)
            {
                return false; // Record not found
            }

            // Update the status
            purchaseOrder.Status = status;

            // Save changes to the database
            await _context.SaveChangesAsync();

            return true; // Status updated successfully
        }


        //Check Exist PO number
        public async Task<bool> CheckExist(string ponumber, int id, int uid)
        {
            if (uid == 0)
            {
                return await _context.PurchaseOrders.AnyAsync(u => u.OrderNumber == ponumber && u.CreatedBy == id);
            }
            else
            {
                return await _context.PurchaseOrders.AnyAsync(u =>
                    u.OrderNumber == ponumber &&
                    u.CreatedBy == id &&
                    u.Id != uid
                );
            }
        }

    }
}

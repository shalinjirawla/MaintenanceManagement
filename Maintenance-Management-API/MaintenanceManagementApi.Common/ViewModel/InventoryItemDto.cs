using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class InventoryItemDto
    {
      
        public int Id { get; set; }
        public string Name { get; set; }
        public int InventoryCategoryId { get; set; }
        public InventoryCategoryDto? InventoryCategory { get; set; }        
        public string SKU { get; set; }
        public string Unit {  get; set; }
        public string Description { get; set; }
        public int? AvailableQuantity { get; set; }
        public int? AllocatedQuantity { get; set; }
        public int? OnHandQuantity { get; set; }
        public int? IncomingQuantity { get; set; }
        public int? MinimumQuantity { get; set; }
        public int? ReorderLevel { get; set; }
        public decimal? Price { get; set; }
        public string Location { get; set; }
        public int? VendorId { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.Now;
        public string? Status { get; set; }
        public bool? IsActive { get; set; }
        public int HadAdminId { get; set; }
        public UserDto? HadAdmin { get; set; }
    }
}

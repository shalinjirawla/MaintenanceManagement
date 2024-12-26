using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class PurchaseOrderItemDto
    {
        public int Id { get; set; } // Primary key for the item               
        public string ItemName { get; set; } // Name of the item in the purchase order
        public decimal Cost { get; set; } // Cost of the item
    
        public int Quantity { get; set; } // Quantity of the item
        public decimal? Taxes { get; set; }

        public int InventoryItemId { get; set; }
        //public virtual InventoryItemDto InventoryItem { get; set; }

        public int? PurchaseOrderId { get; set; } // Foreign key to the purchase order
       
        //public virtual PurchaseOrderDto PurchaseOrder { get; set; }
    }
}

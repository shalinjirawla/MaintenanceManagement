using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.DBModel
{
    public class PurchaseOrderItem
    {
        [Key]
        public int Id { get; set; } // Primary key for the item

        [Required]
        [StringLength(255)]
        public string ItemName { get; set; } // Name of the item in the purchase order

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Cost { get; set; } // Cost of the item

        [Required]
        public int Quantity { get; set; } // Quantity of the item

        public decimal? Taxes { get; set; }

        [ForeignKey("InventoryItem")]
        public int InventoryItemId { get; set; } // Foreign key to the purchase order

        public virtual InventoryItem InventoryItem { get; set; }

        [ForeignKey("PurchaseOrder")]
        public int PurchaseOrderId { get; set; } // Foreign key to the purchase order

        // Navigation property to the related purchase order
        public virtual PurchaseOrder PurchaseOrder { get; set; }
    }
}

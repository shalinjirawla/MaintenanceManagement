using MaintenanceManagementApi.Common.ViewModel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.DBModel
{
    public class MaintenanceItem
    {
        [Key]
        public int Id { get; set; }            // Item ID
        public string Name { get; set; }       // Item Name
        public decimal Cost { get; set; }      // Item Cost
        public int Quantity { get; set; }      // Item Quantity
        public decimal Tax { get; set; }       // Item Tax
        public int InventoryItemId { get; set; }
        public int? CompletedWorkOrderId { get; set; }  // Foreign Key to Completed Work Order
        public CompletedWorkOrder? CompletedWorkOrder { get; set; }
    }
}

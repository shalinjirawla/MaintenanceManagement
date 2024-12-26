using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class PurchaseOrderListDto
    {
        public int Id { get; set; } // Unique identifier for the purchase order
        public string Title { get; set; } // Title or description of the order
        public string OrderNumber { get; set; } // Unique order number
        public int VendorId { get; set; } // Vendor supplying the items     
        public decimal TotalAmount { get; set; } // Total amount for the order (calculated)       
        public DateTime DateCreated { get; set; }  // Date the order was created      
        public string Status { get; set; } // Status of the purchase order (e.g., Pending, Approved)
        public int Items {  get; set; }
        public int Quantity { get; set; }
        public string Vendorname {  get; set; }
    }
}

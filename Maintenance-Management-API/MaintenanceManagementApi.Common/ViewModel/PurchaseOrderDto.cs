﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class PurchaseOrderDto
    {

        public int Id { get; set; } // Unique identifier for the purchase order
        public string Title { get; set; } // Title or description of the order
        public string OrderNumber { get; set; } // Unique order number
        public int VendorId { get; set; } // Vendor supplying the items
        public VendorDto? Vendor { get; set; }
        public decimal? OtherCost { get; set; } // Additional costs (nullable)
        public decimal TotalAmount { get; set; } // Total amount for the order (calculated)
        public DateTime ExpectedDeliveryDate { get; set; } // Expected delivery date
        public DateTime? ReceivedDate { get; set; } // Date the order was received (nullable)
        public DateTime DateCreated { get; set; }  // Date the order was created
        public int CreatedBy { get; set; } // User ID of the creator
        public string Status { get; set; } // Status of the purchase order (e.g., Pending, Approved)

        public List<PurchaseOrderItemDto> PurchaseOrderItems { get; set; } = new List<PurchaseOrderItemDto>(); // List of items in the purchase order
    }
}
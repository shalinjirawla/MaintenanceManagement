using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class InventoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int? AvailableQuantity { get; set; }
        public int? AllocatedQuantity { get; set; }
        public int? OnHandQuantity { get; set; }
        public decimal? Price { get; set; }
        public decimal? Taxes { get; set; }
        public string InventoryCategori { get; set; }
        public string Location { get; set; }
        public string Unit { get; set; }
        public string? Status { get; set; }

    }
}

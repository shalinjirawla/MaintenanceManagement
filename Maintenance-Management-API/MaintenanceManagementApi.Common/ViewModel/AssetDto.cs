using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class AssetDto
    {
        public int Id { get; set; }

        [Required] // Required field
        [MaxLength(100)] // Maximum length for asset name
        public string AssetName { get; set; }

        [Required] // Required field
        public string Description { get; set; }

        [Required] // Required field
        public string Model { get; set; }

        [Required] // Required field
        public string SerialNumber { get; set; }

        [Required] // Required field
        public string Category { get; set; }

        [Required] // Required field
        public string Location { get; set; }

        [Required] // Required field
        public DateTime PurchaseDate { get; set; }

        [Required] // Required field
        public DateTime WarrantyExpiration { get; set; }

        [Required] // Required field
        public string Condition { get; set; }

        public string? AssetImage { get; set; } // Optional field
        public string? Hadadmin { get; set; }
    }
}

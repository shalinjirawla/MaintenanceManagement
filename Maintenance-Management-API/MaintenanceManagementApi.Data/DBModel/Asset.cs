using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.DBModel
{
    public class Asset
    {
        [Key] // Primary key
        public int Id { get; set; }

        [Required] 
        [MaxLength(100)]
        public string AssetName { get; set; }

        [Required]
        public string Description { get; set; }

        [Required] 
        public string Model { get; set; } 

        [Required] 
        public string SerialNumber { get; set; } 

        [Required] 
        public string Category { get; set; } 

        [Required] 
        public string Location { get; set; }

        [Required]
        public DateTime PurchaseDate { get; set; }

        [Required] 
        public DateTime WarrantyExpiration { get; set; }

        [Required]
        public string Condition { get; set; } 

        public string? AssetImage { get; set; } // Optional field

        public int Hadadmin {  get; set; }
    }
}

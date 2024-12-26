using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.DBModel
{
    public class InventoryCategory
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string CategoryName { get; set; }

        [MaxLength(250)]
        public string Description { get; set; }

        public int HadAdminId { get; set; }
        public User? HadAdmin { get; set; }
        public bool IsActive { get; set; } = true;
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.DBModel
{
    public class Vendor
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        public string CompanyName { get; set; }
        [MaxLength(200)]
        public string Address { get; set; }

        [MaxLength(50)]
        public string ContactNumber { get; set; }

        [MaxLength(100)]
        public string Email { get; set; }

        [MaxLength(100)]
        public string ContactPerson { get; set; }
        public int HadAdminId { get; set; }
        public User? HadAdmin { get; set; }

        public bool IsActive { get; set; } = true;
    }
}

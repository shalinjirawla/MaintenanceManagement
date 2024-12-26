using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.DBModel
{
    public class User
    {
        [Key]
        public int UserID { get; set; } // Primary Key
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }

        public int RoleID { get; set; } // Foreign Key
        public Role? Role { get; set; } // Navigation property for Role
        // Self-referencing foreign key for Admin User
        public int HadAdminId { get; set; }
        public User? HadAdmin { get; set; }
        public DateTime? CreatedAt { get; set; } = DateTime.Now;
        public DateTime? UpdatedAt { get; set; }
    }
}

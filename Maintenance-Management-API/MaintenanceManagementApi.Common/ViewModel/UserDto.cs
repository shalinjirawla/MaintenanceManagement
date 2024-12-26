using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class UserDto
    {
        public int? UserID { get; set; } // Primary Key
        public string? Username { get; set; }
        public string? Email { get; set; }
        public int? RoleID { get; set; } // Foreign Key
        public string? Password { get; set; }
        public string? RoleName { get; set; } // Role name can be included for ease
        public int? HadAdminId { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}

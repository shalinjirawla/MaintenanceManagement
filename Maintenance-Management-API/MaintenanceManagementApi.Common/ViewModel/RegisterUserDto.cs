using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class RegisterUserDto
    {
        public int UserID { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; } // Sensitive information for registration only
        public int RoleID { get; set; } // Foreign Key for Role
        public int HadAdminId { get; set; }
    }
}

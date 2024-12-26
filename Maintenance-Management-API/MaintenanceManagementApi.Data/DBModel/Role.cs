using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.DBModel
{
    public class Role
    {
        [Key]
        public int RoleID { get; set; } // Primary Key
        public string RoleName { get; set; }

        public ICollection<User> Users { get; set; } // Navigation property for Users
        public ICollection<RoleRight> RoleRights { get; set; } // Navigation for RoleRights
    }
}

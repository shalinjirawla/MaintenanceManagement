using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.DBModel
{
    public class RoleRight
    {
        [Key]
        public int RoleID { get; set; } // Composite Primary Key
        public Role Role { get; set; } // Navigation property for Role
        [Key]
        public int RightsID { get; set; } // Composite Primary Key
        public Right Right { get; set; } // Navigation property for Right
    }
}

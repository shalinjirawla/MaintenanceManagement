using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.DBModel
{
    public class Right
    {
        [Key]
        public int RightsID { get; set; } // Primary Key
        public string RightsName { get; set; }

        public ICollection<RoleRight> RoleRights { get; set; } // Navigation for RoleRights
    }
}

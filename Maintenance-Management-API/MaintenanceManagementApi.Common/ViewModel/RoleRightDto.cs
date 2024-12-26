using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class RoleRightDto
    {
        public int RoleID { get; set; } // Role ID
        public string RoleName { get; set; } // Name of the role
        public int RightsID { get; set; } // Right ID
        public string RightsName { get; set; } // Name of the right
    }
}

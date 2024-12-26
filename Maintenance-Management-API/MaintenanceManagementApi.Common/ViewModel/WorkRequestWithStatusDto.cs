using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class WorkRequestWithStatusDto
    {
        public WorkRequestDto WorkRequest { get; set; }
        public int? Status { get; set; } // Assuming Status is a string
        public string? Body { get; set; }
        public UserDto CreatedByUser { get; set; } // Use the new UserInfo class
    }
}

using MaintenanceManagementApi.Data.DBModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.DBModel
{
    public class WorkRequestWithStatus
    {
        public WorkRequest WorkRequest { get; set; }
        public int? Status { get; set; } // Assuming Status is a string
        public string? Body { get; set; }
        public User CreatedByUser { get; set; } // Use the new UserInfo class
    }
}

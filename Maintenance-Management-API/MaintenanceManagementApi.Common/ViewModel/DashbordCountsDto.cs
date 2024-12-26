using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class DashbordCountsDto
    {
        public int TotalCount { get; set; }
        public int? CountingCount { get; set; }
        public string Name { get; set; }
    }
}

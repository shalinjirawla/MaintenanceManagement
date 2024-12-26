using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class DeclineRequestDto
    {
        public int Id { get; set; }
        public string DeclineReason { get; set; }
    }
}

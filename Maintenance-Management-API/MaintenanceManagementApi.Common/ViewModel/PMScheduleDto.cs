using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class PMScheduleDto
    {
        public int Id { get; set; }
        public string ScheduleType { get; set; }
        public int? FrequencyInterval { get; set; }
        public string? FrequencyType { get; set; }
        public string? DaysOfWeek { get; set; }
        public int WorkOrderDue { get; set; }
        public string AdvanceCreationPeriod { get; set; }
        public DateTime? NextDueDate { get; set; }
        public DateTime? LastGeneratedDate { get; set; }
        [ForeignKey("PreventiveMaintenance")]
        public int PMId { get; set; }
        public PreventiveMaintenanceDto PreventiveMaintenancedto { get; set; }
        public int? WOId { get; set; }
    }
}

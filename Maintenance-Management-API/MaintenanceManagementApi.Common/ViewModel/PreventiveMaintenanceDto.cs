using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class PreventiveMaintenanceDto
    {
        public int? Id { get; set; }
        public string? Title { get; set; }
        public string? Priority { get; set; }
        public string? Category { get; set; }
        public int? Asset { get; set; }
        public string? AssetName { get; set; }
        public int? Location { get; set; }
        public string? Locationname { get; set; }
        public int? AssignTo { get; set; }
        public string? AssignToName { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? DueDate { get; set; }
        public string? Description { get; set; }
        public int? CreatedBy { get; set; }

        public string? ScheduleType { get; set; }
        public int? FrequencyInterval { get; set; }
        public string? FrequencyType { get; set; }
        public string? DaysOfWeek { get; set; }
        public int? WorkOrderDue { get; set; }
        public string? AdvanceCreationPeriod { get; set; }

        public DateTime? LastGeneratedDate { get; set; }
        public DateTime? NextDueDate { get; set; }

        public DateTime? ComplationDate {  get; set; }
        public int? WoId { get; set; }

    }
}

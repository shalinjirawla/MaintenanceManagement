using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class CompletedWorkOrderDto
    {
        public int Id { get; set; }
        public int WorkOrderID { get; set; }
     //   [ForeignKey("WorkOrderID")]
       // public WorkOrderDto? WorkOrderId { get; set; }
        public string? Status { get; set; }   // Updated status of the work order
        public DateTime? CompletionDate { get; set; }= DateTime.Now;          // Date the work was completed
        public string? NotesComments { get; set; }              // General notes or comments regarding the work
        public string? ProofOfCompletion { get; set; }          // URL or path to completion proof document/image
        public string? AdminReviewStatus { get; set; }          // Status of admin review and approval
        public string? DescriptionOfOccurrence { get; set; }    // Description of what occurred during the task
        public string? ChallengesEncountered { get; set; }      // Challenges encountered
        public string? SparePartsMaterialsUsed { get; set; }    // List of all parts and materials used
        public string? ExtraWorkDetails { get; set; }           // Additional work done outside the original scope
        public string? PlanDeviations { get; set; }             // Deviations from the original plan
        public int? ActualLaborHours { get; set; }          // Total labor hours spent (e.g., 6.00 for 6 hours)
        public string? WorkHours { get; set; }
        public List<MaintenanceItemDto> MaintenanceItem { get; set; } = new List<MaintenanceItemDto>(); // List of items in the purchase order
    }
}

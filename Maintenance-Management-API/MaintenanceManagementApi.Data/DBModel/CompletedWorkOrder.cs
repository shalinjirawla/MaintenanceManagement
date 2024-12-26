using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.DBModel
{
    public class CompletedWorkOrder
    {
        [Key]
        public int Id { get; set; }                
        public int WorkOrderId { get; set; }
        [ForeignKey("WorkOrderId")]
        public WorkOrder? WorkOrder { get; set; }
        public string? Status { get; set; }    
        public DateTime CompletionDate { get; set; }      
        public string? NotesComments { get; set; }          
        public string? ProofOfCompletion { get; set; }        
        public string? AdminReviewStatus { get; set; }          
        public string? DescriptionOfOccurrence { get; set; }  
        public string? ChallengesEncountered { get; set; }     
        public string? SparePartsMaterialsUsed { get; set; }   
        public string? ExtraWorkDetails { get; set; }          
        public string? PlanDeviations { get; set; }            
        public int ActualLaborHours { get; set; }         
        public string? WorkHours { get; set; }
    }
}

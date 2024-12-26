using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.DBModel
{
    public class WorkOrder
    {
        [Key]
        public int Id { get; set; }                
        public string? Title { get; set; }        
        public string? Description { get; set; }   
        public DateTime DueDate { get; set; }      
        public DateTime StartDate { get; set; }   
        public string? Status { get; set; }       
        public string? Priority { get; set; }      
        public string? Category { get; set; }      
        public string? Location { get; set; }       
        public string? Asset { get; set; }         
        public int AssignedTo { get; set; }
        [ForeignKey("AssignedTo")]
        public User? AssignedToUser { get; set; }
        public string? AdditionalWorkers { get; set; } 
        public int RequestedId { get; set; }
        //[ForeignKey("RequestedId")]
        //public WorkRequest workRequestedId { get; set; }
        public string? Team { get; set; }          
        public DateTime? DateCreated { get; set; } = new DateTime();
        public string? Comment { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.DBModel
{
    public class CustomerFeedback
    {
        [Key]
        public int Id { get; set; }              
        public int CustomerID { get; set; }           
        [ForeignKey("CustomerID")]
        public User? RequesterUser { get; set; }
        public int WorkRequestID  { get; set; }
        [ForeignKey("WorkRequestID")]
        public WorkRequest? WorkRequestFeed { get; set; }
        public string Satisfied { get; set; }
        public string Comments { get; set; }
        public string InFuture { get; set; }
        public DateTime FeedbackDate { get; set; } = DateTime.Now;               
        public int? ResolvedStatus { get; set; }        
        public string? ResolutionNotes { get; set; }  
    }
}

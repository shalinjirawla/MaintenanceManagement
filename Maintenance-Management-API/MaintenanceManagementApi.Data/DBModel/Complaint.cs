using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.DBModel
{
    public class Complaint
    {
        [Key]
        public int Id { get; set; }
        public int CustomerID { get; set; }
        [ForeignKey("CustomerID")]
        public User? RequesterUser { get; set; }
        public int WorkRequestID { get; set; }
        [ForeignKey("WorkRequestID")]
        public WorkRequest? WorkRequestFeed { get; set; }
        public string Title { get; set; }    
        public string Description { get; set; }
        public string Priority { get; set; }
        public string Attachment { get; set; }
        public int Status { get; set; }
        public DateTime ComplaintDate { get; set; }= DateTime.Now;

    }
}

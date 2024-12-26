using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.DBModel
{
    public class WorkRequest
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Priority { get; set; }
        public string? Image {  get; set; }
        public string? Status {  get; set; } 
        public int CreatedBy { get; set; }
        [ForeignKey("CreatedBy")]
        public User CreatedByUser { get; set; }
        public DateTime CreatedDate {  get; set; } = DateTime.Now;
        public int HadAdminId { get; set; }
        public User? HadAdmin { get; set; }
        public decimal? EstimatedCost {  get; set; }
        public int? Location { get; set; }
        public int? ApprovedBy { get; set; }
        [ForeignKey("ApprovedBy")]
        public User ApprovedByUser { get; set; }
        public DateTime? ApprovedDate { get;set; }
        public string? Comment { get; set; }

    }
}

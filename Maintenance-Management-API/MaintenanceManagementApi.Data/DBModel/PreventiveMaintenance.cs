using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.DBModel
{
    public class PreventiveMaintenance
    {
        [Key]
        public int Id { get; set; }  
        public string Title { get; set; }
        public string Priority { get; set; }
        public string Category { get; set; }
        public int Asset { get; set; }
        public int Location { get; set; }
        public int AssignTo { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? DueDate { get; set; }
        public int CreatedBy  { get; set; }
        [ForeignKey("CreatedBy")]
        public User? CreatedByUser { get; set; }
        public string Description { get; set; }
        public ICollection<PMSchedule> PMSchedules { get; set; }
    }
}

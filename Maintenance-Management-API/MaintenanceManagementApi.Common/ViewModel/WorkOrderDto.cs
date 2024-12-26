using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class WorkOrderDto
    {
        public int? Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? StartDate { get; set; }
        public string? Status { get; set; }
        public string? Priority { get; set; }
        public string? Category { get; set; }
        public string? Location { get; set; }
        public string? LocationName { get; set; }
        public string? Asset { get; set; }
        public int? AssignedTo { get; set; }
        public string? AssignedToUser { get; set; }
        public string? RequestedToUser { get; set; }
        //  public UserDto? AssignedToUser { get; set; }
        public string? AdditionalWorkers { get; set; }
        public int? RequestedId { get; set; }
        public string? Team { get; set; }
        public DateTime? DateCreated { get; set; } = DateTime.Now;
        public decimal? EstimatedCost { get; set; }
        public string? Comment { get; set; }
        public string? EmailCustomer { get; set; }
        public string? Payment { get; set; }
    }
}

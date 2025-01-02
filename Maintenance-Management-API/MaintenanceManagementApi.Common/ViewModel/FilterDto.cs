using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class FilterDto
    {
        public int? Id { get; set; }
        public string? Title { get; set; }
        public string? Status { get; set; }
        public string? DueDate { get; set; }
        public string? StartDate { get; set; }
        public string? Priority { get; set; }
        public string? AssignedTo { get; set; }
        public string? CreatedDate {  get; set; }
        public int? CreatedBy { get; set; }
        public string? Username { get; set; }
        public string? Email { get; set; }
        public string? Role { get; set; }

        public string? AssetName { get; set; }          
        public string? Model { get; set; }     
        public string? SerialNumber { get; set; }      
        public string? Category { get; set; }     
        public string? Location { get; set; }    
        public string? Name { get; set; }
        public string? ScheduleType { get; set; }
        public string? Description { get; set; }
        public string? Sku { get; set; }
        public string? Unit { get; set; }
        public string? Companyname { get; set; }
        public string? Contact { get; set; }
        public string? PaymentId { get; set; }
        public string? Amount { get; set; }
        public int? RequestId { get; set; }
        public int? WorkorderId { get; set; }
        public int? Totalcost { get; set; }
        public string? Vendor { get; set; }
        public string? Ponumber { get; set; }
    }
}

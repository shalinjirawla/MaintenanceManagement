using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class ComplaintDto
    {
        public int? Id { get; set; }
        public int? CustomerID { get; set; }

        public UserDto? RequesterUser { get; set; }
        public int? WorkRequestID { get; set; }
     
        public WorkRequestDto? WorkRequestFeed { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Priority { get; set; }
        public string? Category { get; set; }
        public string? Location { get; set; }
        public string? Asset { get; set; }
        public string? Attachment { get; set; }
        public int Status { get; set; }

        public DateTime? ComplaintDate { get; set; } = DateTime.Now;
    }
}

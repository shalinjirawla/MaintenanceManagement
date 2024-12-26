using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class PaymentDto
    {
        public int Id { get; set; }
        public string? PaymentId { get; set; }
        public DateTime? Datetime { get; set; } = DateTime.Now;
        public string Amount { get; set; }
        public string? Email { get; set; }
        public int WorkorderId { get; set; }
        public int RequestId { get; set; }
        public string Status { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.DBModel
{
    public class Payment
    {
        public int Id { get; set; }
        public string PaymentId { get; set; }
        public DateTime Datetime { get; set; }
        public string Amount { get; set; }
        public string? Email { get; set; }
        [ForeignKey("WorkOrder")]
        public int WorkorderId { get; set; }
        [ForeignKey("WorkRequest")]
        public int RequestId { get; set; }
        public string Status { get; set; }
    }
}

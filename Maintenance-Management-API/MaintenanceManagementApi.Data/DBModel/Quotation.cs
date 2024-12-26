using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.DBModel
{
    public class Quotation
    {
        [Key]
        public int Id { get; set; }
        public string Sender { get; set; }     // Sender's email address
        public string Recipient { get; set; }  // Recipient's email address
        public string Subject { get; set; }    // Email subject
        public string Body { get; set; }
        public int RequestId { get; set; }
        [ForeignKey("RequestId")]
        public WorkRequest WorkRequest { get; set; }
        public int Status { get; set; }
        //public virtual ICollection<Quotation> Quotations { get; set; }

    }
}

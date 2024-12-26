using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class EmailPayloadDto
    {
        public string Sender { get; set; }     // Sender's email address
        public string Recipient { get; set; }  // Recipient's email address
        public string Subject { get; set; }    // Email subject
        public string Body { get; set; }
        public int RequestId { get; set; }
        public int Status { get; set; }
    }
}

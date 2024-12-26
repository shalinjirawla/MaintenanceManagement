using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class PaymentRequestDto
    {
        public int Amount { get; set; }
        public string? Email { get; set; }
    }
}

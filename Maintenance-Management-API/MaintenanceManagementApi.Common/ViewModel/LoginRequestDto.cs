using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class LoginRequestDto
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public int HadAdminId { get; set; }
        public string? Adminname { get; set; }
    }
}

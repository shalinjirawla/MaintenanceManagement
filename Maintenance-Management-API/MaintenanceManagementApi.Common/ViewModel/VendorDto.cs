using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class VendorDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CompanyName { get; set; }
        public string Address { get; set; }  
        public string ContactNumber { get; set; }
        public string Email { get; set; }       
        public string ContactPerson { get; set; }
        public int HadAdminId { get; set; }
        //public UserDto? HadAdmin { get; set; }
        public bool? IsActive { get; set; } = true;
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class InventoryCategoryDto
    {
       
        public int Id { get; set; }       
        public string CategoryName { get; set; }     
        public string Description { get; set; }
        public int HadAdminId { get; set; }
        public UserDto? HadAdmin { get; set; }
        public bool IsActive { get; set; } = true;
    }
}

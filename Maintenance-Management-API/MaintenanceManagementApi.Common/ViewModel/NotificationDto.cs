using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Common.ViewModel
{
    public class NotificationDto
    {
        [Key]
        public int Id { get; set; }

        public int SenderID { get; set; }
       
        public int ReciverId { get; set; }       

        public string Message { get; set; }

        public bool IsRead { get; set; } = false;
        public string? SenderName { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.DBModel
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        public int SenderID { get; set; }
        [ForeignKey("UserID")]
       // public User? Sender { get; set; }
        public int ReciverId { get; set; }
        [ForeignKey("UserID")]
      //  public User? Reciver { get; set; }

        public string Message { get; set; }

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime UpdatedAt { get; set; } = DateTime.Now;
    }
}

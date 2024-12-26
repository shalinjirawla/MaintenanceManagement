using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NotificationHub.Domain.Hub
{
    public class Notification
    {
        public string ProductID { get; set; }
        public string ProductName { get; set; }
        public string Message { get; set; }
    }
}

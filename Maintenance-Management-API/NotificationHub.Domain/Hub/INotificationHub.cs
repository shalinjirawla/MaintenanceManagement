using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NotificationHub.Domain.Hub
{
    public interface INotificationHub
    {
        public Task SendMessage(Notification notification);
    }
}

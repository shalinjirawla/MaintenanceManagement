using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.Hubs
{
    public class NotificationHub: Hub
    {
        public async Task SendNotification(string userId, string message)
        {
            // Send notification to a specific user
            await Clients.User(userId).SendAsync("ReceiveNotification", message);
        }

    }
}

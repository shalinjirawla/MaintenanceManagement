using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.IRepository
{
    public interface INotificationRepository
    {
        // Add new notification
        Task<int> Insert(Notification notification);

        //Get Notification
        Task<List<NotificationDto>> Getnotification(int id);

        // Mark notification as read
        Task<bool> MarkAsRead(int id);

        //mark as all read by module
        Task<bool> MarkAllAsRead(int id, string message);

       
    }
}

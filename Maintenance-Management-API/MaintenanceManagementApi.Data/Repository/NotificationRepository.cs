using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DataDbContext;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Data.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.Repository
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly AppDbContext _context;

        public NotificationRepository(AppDbContext context)
        {
            _context = context;
        }

        // Add new notification
        public async Task<int> Insert(Notification notification)
        {
            await _context.Notifications.AddAsync(notification);
            _context.SaveChanges();
            return notification.Id;

        }

        //Get Notification
        public async Task<List<NotificationDto>> Getnotification(int id)
        {
            //return await _context.Notifications.Where(n => n.ReciverId == id && n.IsRead == false).ToListAsync();
            var result = await (from notification in _context.Notifications
                                join user in _context.Users on notification.SenderID equals user.UserID
                                where notification.ReciverId == id && notification.IsRead == false
                                select new NotificationDto
                                {
                                    Id = notification.Id,
                                    SenderID = notification.SenderID,
                                    SenderName = user.Username, // Assuming the username is stored here
                                    Message = notification.Message,
                                    IsRead = notification.IsRead,
                                    ReciverId = notification.ReciverId
                                }).ToListAsync();

            return result;
        }

        // Mark notification as read
        public async Task<bool> MarkAsRead(int id)
        {
            var notification =  _context.Notifications.FirstOrDefault(n => n.Id == id);
            if (notification == null)
            {
                return false; // Notification not found
            }

            notification.IsRead = true;
            _context.SaveChanges();
            return true; // Successfully updated
        }

        //mark as all read by module
        public async Task<bool> MarkAllAsRead(int id, string message)
        {
            var messages = message.Split(',');
            bool anyUpdated = false;

            foreach (var msg in messages)
            {
                // Trim each message to remove any leading or trailing whitespace
              //  var trimmedMessage = msg.Trim();

                // Fetch all unread notifications for the given user and message
                var notifications = _context.Notifications
            .Where(n =>n.ReciverId==id && n.Message.Contains(msg) && n.IsRead==false)
            .ToList();

                if (notifications != null && notifications.Count > 0)
                {
                    // Mark all notifications as read for this message
                    foreach (var notification in notifications)
                    {
                        notification.IsRead = true;
                    }

                    // Save changes to the database
                    _context.SaveChanges();
                    anyUpdated = true;
                }
            }

            return anyUpdated;

        }
    }

}

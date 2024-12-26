using AutoMapper;
using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Data.IRepository;
using MaintenanceManagementApi.Data.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.Service
{
    public class NotificationService:INotificationService
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IMapper _mapper;

        public NotificationService(INotificationRepository notificationRepository,IMapper mapper)
        {
            _notificationRepository = notificationRepository;
            _mapper = mapper;
        }

        // Add new notification
        public async Task<int> Insert(NotificationDto notification)
        {
            var data = _mapper.Map<Notification>(notification);
            return await _notificationRepository.Insert(data);
        }

        //Get Notification
        public async Task<List<NotificationDto>> Getnotification(int id)
        {
           return  await _notificationRepository.Getnotification(id);
           
        }

        // Mark notification as read
        public async Task<bool> MarkAsRead(int id)
        {
            var data = _notificationRepository.MarkAsRead(id);
            return true;
        }

        //mark as all read by module
        public async Task<bool> MarkAllAsRead(int id, string message)
        {
            var data = _notificationRepository.MarkAllAsRead(id,message);
            return true;
        }
    }
}

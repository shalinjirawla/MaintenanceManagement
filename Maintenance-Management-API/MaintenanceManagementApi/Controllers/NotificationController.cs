using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Bussiness.Service;
using MaintenanceManagementApi.Common.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MaintenanceManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        // Add new notification
        [HttpPost]
        public async Task<IActionResult> AddRequest(NotificationDto notification)
        {
            if (notification == null)
            {
                return BadRequest("Invalid user data.");
            }         
                      
            await _notificationService.Insert(notification);
            return Ok();
        }

        //Get Notification
        [HttpGet("getnotification/{id}")]
        public async Task<ActionResult<List<NotificationDto>>> Getnotification(int id)
        {
            var data = await _notificationService.Getnotification(id);
            return Ok(data);
        }

        // Mark notification as read
        [HttpPut("markasread/{id}")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            // Call the service to update the notification's 'isRead' flag to true
            var result = await _notificationService.MarkAsRead(id);

            if (result)
            {
                return Ok(new { message = "Notification marked as read." });
            }
            else
            {
                return NotFound(new { message = "Notification not found." });
            }
        }

        //mark as all read by module
        [HttpPost("markasallread")]
        public async Task<IActionResult> MarkAsAllRead([FromBody] MessageDto message)
        {
            if (string.IsNullOrEmpty(message.Message))
            {
                return BadRequest("Message cannot be empty.");
            }

            // Example service call where you handle marking notifications as read
            var result = await _notificationService.MarkAllAsRead(message.Id, message.Message);

            if (result)
            {
                return Ok(new { success = true });
            }

            return BadRequest(new { success = false });
        }
        public class MessageDto
        {
            public int Id { get; set; }
            public string Message { get; set; }
        }



    }
}

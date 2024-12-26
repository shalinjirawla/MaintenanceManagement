using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Bussiness.Service;
using MaintenanceManagementApi.Common.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MaintenanceManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // Register New User
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserDto registerDto)
        {
            var user = await _userService.Insert(registerDto);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        // Get All emplyee with all details
        [HttpGet("getusers/{id}")]
        public async Task<IActionResult> GetEmployeeall(int id)
        {
            var data = await _userService.GetAllEmployeeall(id); // Change this method accordingly
            return Ok(data);
        }

        // Get available employees
        [HttpGet("GetAvailableEmployees")]
        public async Task<IActionResult> GetAvailableEmployees(DateTime startDate, DateTime endDate, int hadid)
        {
            var availableEmployees = await _userService.GetAvailableEmployees(startDate, endDate,hadid);
            return Ok(availableEmployees);
        }

        // Get Role By Id
        [HttpGet("getUserRole/{role}")]
        public async Task<IActionResult> GetRole(string role)
        {
            var data = await _userService.GetRoleById(role); // Change this method accordingly
            return Ok(data);
        }

        //Delete User
        [HttpDelete("deleteusers")]
        public async Task<IActionResult> DeleteUsers([FromBody] List<int> ids)
        {
            if (ids == null || !ids.Any())
            {
                return BadRequest("No IDs provided.");
            }
           
            var count = await _userService.DeleteUsers(ids);
            
            return Ok(count);
        }

        //Advance Filter User 
        [HttpGet("Filterdata")]
        public async Task<ActionResult<IEnumerable<RegisterUserDto>>> GetUsers([FromQuery] FilterDto filter)
        {
            var workrequest = await _userService.GetFilteredUsers(filter);
            return Ok(workrequest);
        }

        // Get All emplyee count by admin
        [HttpGet("getuserscount/{id}")]
        public async Task<IActionResult> GetEmployeeallcount(int id)
        {
            var data = await _userService.GetAllEmployeeallcount(id); // Change this method accordingly
            return Ok(data);
        }
      
    }
}

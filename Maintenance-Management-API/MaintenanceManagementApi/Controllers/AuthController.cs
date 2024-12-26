using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Bussiness.Service;
using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MaintenanceManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }      

        //Authenticate user
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto logindata)
         {
            var token = await _authService.Authenticate(logindata.Username, logindata.Password, logindata.Adminname);

            if (token == null)
            {
                return Unauthorized();  // Invalid username or password
            }

            // Generate JWT Token with user roles and rights
            return Ok(new { token });
        }

        //logout user
        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (!string.IsNullOrEmpty(token))
            {
                // Optional: Verify and blacklist the token if necessary
                // _authService.BlacklistToken(token);
            }

            return Ok(new { message = "Logged out successfully." });
        }

        // Get All Admins
        [HttpGet("getalladmins")]
        public async Task<IActionResult> GetAlladmin()
        {
            var alladmin = await _authService.GetAlladmin();
            return Ok(alladmin);
        }


    }
}

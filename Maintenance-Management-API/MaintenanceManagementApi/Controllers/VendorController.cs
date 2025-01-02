using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Bussiness.Service;
using MaintenanceManagementApi.Common.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Stripe.Terminal;

namespace MaintenanceManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class VendorController : ControllerBase
    {
        private readonly IVendorService _vendorService;
        private readonly IGenericFilterService<VendorDto> _iGenericFilterService;

        public VendorController(IVendorService vendorService, IGenericFilterService<VendorDto> iGenericFilterService)
        {
            _vendorService = vendorService;
            _iGenericFilterService = iGenericFilterService;
        }

        // Register New Vendor  
        [HttpPost]
        public async Task<IActionResult> Register(VendorDto vendorDto)
        {
            var user = await _vendorService.Insert(vendorDto);
            if (user == null)
            {
                return BadRequest("Failed to register vendor");
            }
            return Ok(user);
        }

        // Get Vendor by Admin
        [HttpGet("getvendor/{id}")]
        public async Task<IActionResult> GetVendor(int id)
        {
            var data = await _vendorService.GetVendor(id); // Change this method accordingly
            return Ok(data);
        }

        //Delete Vendor
        [HttpDelete("deletevendor")]
        public async Task<IActionResult> DeleteVendor([FromBody] List<int> ids)
        {
            if (ids == null || !ids.Any())
            {
                return BadRequest("No IDs provided.");
            }

            var count = await _vendorService.DeleteVendor(ids);

            return Ok(count);
        }
        //Advance Filter Vendore
        [HttpGet("FilterVendor")]
        public async Task<ActionResult<IEnumerable<VendorDto>>> FilterLocations([FromQuery] FilterDto filter)
        {
            var locations = await _iGenericFilterService.GetFilteredData(filter);
            return Ok(locations);
        }
    }
}

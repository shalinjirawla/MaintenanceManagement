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
    public class LocationController : ControllerBase
    {
        private readonly ILocationService _locationService;
        private readonly IGenericFilterService<LocationDto> _iGenericFilterService;

        public LocationController(ILocationService locationService, IGenericFilterService<LocationDto> iGenericFilterService)
        {
            _locationService = locationService;
            _iGenericFilterService = iGenericFilterService;
        }

        // Add new Location
        [HttpPost]
        public async Task<IActionResult> AddLocation(LocationDto locationDto)
        {
            if (locationDto == null)
            {
                return BadRequest("Invalid user data.");
            }
            await _locationService.Insert(locationDto);
            return Ok();
        }

        //Get All Location by hadadmin
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _locationService.GetAll();
            return Ok(data);
        }

        //Get By Admin id Location
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdlocation(int id)
        {
            var data = await _locationService.GetById(id);
            return Ok(data);
        }

        // Delete Location
        [HttpDelete("delete")]
        public async Task<IActionResult> Delete([FromBody] List<int> id)
        {
            var result = await _locationService.Delete(id);
            if (result)
            {
                return NoContent(); // 204 No Content
            }
            else
            {
                return NotFound(); // 404 Not Found if the item is not found
            }
        }

        //Advance Filter location
        [HttpGet("FilterLocations")]
        public async Task<ActionResult<IEnumerable<LocationDto>>> FilterLocations([FromQuery] FilterDto filter)
        {
            var locations = await _iGenericFilterService.GetFilteredData(filter);
            return Ok(locations);
        }
    }
}

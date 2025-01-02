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
    public class PreventiveMaintenanceController : ControllerBase
    {
        private readonly IPreventiveMaintenanceService _preventiveMaintenanceService;
        private readonly IGenericFilterService<PreventiveMaintenanceDto> _iGenericFilterService;

        public PreventiveMaintenanceController(IPreventiveMaintenanceService preventiveMaintenanceService, IGenericFilterService<PreventiveMaintenanceDto> iGenericFilterService)
        {
            _preventiveMaintenanceService = preventiveMaintenanceService;
            _iGenericFilterService = iGenericFilterService;
        }

        // Add new Preventive Maintenance
        [HttpPost]
        public async Task<IActionResult> PreventiveMaintenanceadd(PreventiveMaintenanceDto pmdto)
        {
            var pmdata = await _preventiveMaintenanceService.Insert(pmdto);
            if (pmdata == null)
            {
                return NotFound();
            }
            return Ok(new { id = pmdata });
        }

        //Get All Preventive Maintanance
        [HttpGet]
        public async Task<IActionResult> GetAllPM()
        {
            var data = await _preventiveMaintenanceService.GetAll();            
            return Ok(data);
        }

        //Get Preventive Maintenace By Admin
        [HttpGet("{id}")]
        public async Task<IActionResult>GetPMByAdmin(int id)
        {
            var data = await _preventiveMaintenanceService.GetAllPMById(id);
        //  await _preventiveMaintenanceService.GenerateWorkOrdersAsync();
            return Ok(data);
        }

        // Delete Preventive Maintenance
        [HttpDelete("deletepm")]
        public async Task<IActionResult> DeletePreventiveMaintenance([FromBody] List<int> id)
        {
            if (id == null || !id.Any())
            {
                return BadRequest("No IDs provided.");
            }
            var result = await _preventiveMaintenanceService.Delete(id);
            if (result)
            {
                return NoContent(); // 204 No Content
            }
            else
            {
                return NotFound(); // 404 Not Found if the item is not found
            }
        }
        //Advance Filter PM 
        [HttpGet("FilterPM")]
        public async Task<ActionResult<IEnumerable<PreventiveMaintenanceDto>>> GetPM([FromQuery] FilterDto filter)
        {
            var filterpm = await _iGenericFilterService.GetFilteredData(filter);
            return Ok(filterpm);
        }        
    }
}

using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Bussiness.Service;
using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MaintenanceManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WorkOrderController : ControllerBase
    {
        private readonly IWorkOrderService _workOrderService;

        public WorkOrderController(IWorkOrderService workOrderService)
        {
            _workOrderService = workOrderService;
        }

        // Add new WorkOrder
        [HttpPost]
        public async Task<IActionResult> AddWorkOrder(WorkOrderDto workorderDto)
        {
            var user = await _workOrderService.Insert(workorderDto);
            if (user == null)
            {
                return NotFound();
            }
            return Ok();
        }

        //Delete work order
        [HttpDelete("deleteworkorders")]
        public async Task<IActionResult> DeleteWorkOrder([FromBody] List<int> id)
        {
            if (id == null || !id.Any())
            {
                return BadRequest("No IDs provided.");
            }
            var result = await _workOrderService.DeleteWorkOrderById(id);

            if (result)
            {
                // If deletion is successful
                return NoContent(); // 204 No Content (success but no data to return)
            }

            // If no work order found or deletion fails
            return NotFound($"Work order with ID {id} not found.");

        }

        //Get All WorkOrder
        [HttpGet]
        public async Task<IActionResult> GetAllrequest()
        {
            var data = await _workOrderService.GetAll();
            return Ok(data);
        }

        // Get WorkOrder By Role
        [HttpGet("GetbyRoleId")]
        public async Task<IActionResult> GetWorkOrderByRoleId(int id, string role)
        {
            var availableEmployees = await _workOrderService.GetWorkOrderByRoleId(id, role);
            return Ok(availableEmployees);
        }

        //Update WorkOrder Status
        [HttpPut("UpdateStatus")]
        public async Task<IActionResult> UpdateStatus(WorkOrderDto workorderDto)
        {
            var data = await _workOrderService.UpdateStatus(workorderDto);
            return Ok(data);
        }

        //Update WorkOrder 
        [HttpPut("Updateworkorder")]
        public async Task<IActionResult> UpdateWorkorder(WorkOrderDto workorderDto)
        {
            var data = await _workOrderService.UpdateWorkOrder(workorderDto);
            return Ok(data);
        }

        //Advance Filter Workorder
        [HttpGet("Filterdata")]
        public async Task<ActionResult<IEnumerable<WorkOrderDto>>> GetWorkOrders([FromQuery] FilterDto filter)
        {
            var workOrders = await _workOrderService.GetFilteredWorkOrders(filter);
            return Ok(workOrders);
        }

        // Complate workorder
        [HttpPost("Completeworkorder")]
        public async Task<IActionResult> ComplateWorkorder(CompletedWorkOrderDto completedWorkOrderDto)
        {
            var user = await _workOrderService.InsertCompleteworkorder(completedWorkOrderDto);
            if (user == null)
            {
                return NotFound();
            }
            return Ok();
        }

        // review workorder
        [HttpGet("review/{id}")]
        public async Task<ActionResult<IEnumerable<CompletedWorkOrderDto>>> GetReviewWorkOrder(int id)
        {

            var data = await _workOrderService.GetReviewdata(id);
            if (data == null)
            {
                return NotFound(); // Return 404 if not found
            }

            return Ok(data); // Return 200 OK with the work order data
        }

        // get previous assign workorder employee
        [HttpGet("getPreviousassignemployee/{id}")]
        public async Task<IActionResult> GetPreviousassignemployee(int id)
        {
            var data = await _workOrderService.GetPreviousassignemployee(id);
            if (data == null)
            {
                return NotFound(); // Return 404 Not Found if no data is found
            }
            return Ok(data); // Return 200 OK with the employee ID of the previous assignee
        }

        //Get workorder count
        [HttpGet("wocount/{id}")]
        public async Task<ActionResult> Getworkordercount(int id)
        {
            var data = await _workOrderService.Getworkordercount(id);
            return Ok(data);
        }

        //Get workorder Payment complete
        [HttpGet("wopaymentcount/{id}")]
        public async Task<ActionResult> Getpaymentcount(int id)
        {
            var data = await _workOrderService.Getpaymentcount(id);
            return Ok(data);
        }

    }
}

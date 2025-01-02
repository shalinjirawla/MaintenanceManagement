using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Bussiness.Service;
using MaintenanceManagementApi.Common.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace MaintenanceManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseOrderController : ControllerBase
    {
        private readonly IPurchaseOrderService _purchaseOrderService;
        private readonly IGenericFilterService<PurchaseOrderListDto> _iGenericFilterService;

        public PurchaseOrderController(IPurchaseOrderService purchaseOrderService, IGenericFilterService<PurchaseOrderListDto> iGenericFilterService)
        {
            _purchaseOrderService = purchaseOrderService;
            _iGenericFilterService = iGenericFilterService;
        }

        // Add New Purchase Order 
        [HttpPost("addpurchaseorder")]
        public async Task<IActionResult> InsertPurchaseOrder(PurchaseOrderDto po)
        {
            var data = await _purchaseOrderService.InsertPurchaseOrder(po);
            if (data == null)
            {
                return BadRequest("Failed to add Item");
            }
            return Ok(data);

        }

        //Get Purchase Order List By Admin
        [HttpGet("getpuchaseorderlist/{id}")]
        public async Task<IActionResult> GetPurchaseOrderList(int id)
        {
            var data = await _purchaseOrderService.GetPurchaseOrderList(id); // Change this method accordingly
            return Ok(data);
        }

        //Get Purchase Order List By Id
        [HttpGet("getbyidpurchaseorder/{id}")]
        public async Task<IActionResult> GetPurchaseOrderById(int id)
        {
            var data = await _purchaseOrderService.GetPurchaseOrderById(id); // Change this method accordingly
            return Ok(data);
        }


        //Delete Purchase Order 
        [HttpDelete("deletepurchaseorder")]
        public async Task<IActionResult> DeletePurchaseOrder([FromBody] List<int> ids)
        {
            if (ids == null || !ids.Any())
            {
                return BadRequest("No IDs provided.");
            }

            var count = await _purchaseOrderService.DeletePurchaseOrder(ids);

            return Ok(count);
        }

        //Update status
        [HttpPut("updatestatus")]
        public async Task<IActionResult> UpdateStatus([FromBody] UpdateStatusDto dto)
        {
            var result = await _purchaseOrderService.UpdatePurchaseOrderStatus(dto.Id, dto.Status);
            if (!result) return BadRequest("Update failed");            
            return Ok(new { message = "Status updated successfully" });
        }        

        //Check Exist PO number
        [HttpGet("exists")]
        public async Task<bool> CheckPoNoExists(string ponumber, int id, int uid)
        {
            var result = await _purchaseOrderService.CheckExist(ponumber, id, uid);
            return result;
        }

        //Advance Filter purchase order 
        [HttpGet("FilterPurchseOrder")]
        public async Task<ActionResult<IEnumerable<PurchaseOrderListDto>>> FilterPurchseOrder([FromQuery] FilterDto filter)
        {
            var assets = await _iGenericFilterService.GetFilteredData(filter);
            return Ok(assets);
        }

    }
}

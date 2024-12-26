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
    public class AssetController : ControllerBase
    {
        private readonly IAssetService _assetService;

        public AssetController(IAssetService assetService)
        {
            _assetService = assetService;
        }

        // Add new asset
        [HttpPost]
        public async Task<IActionResult> AddRequest([FromForm] AssetDto assettDto, [FromForm] IFormFile[]? images)
        {
            if (assettDto == null)
            {
                return BadRequest("Invalid user data.");
            }   
            List<string> imageNames = new List<string>();
            // Process images if any
            if (images != null && images.Length > 0)
            {
                foreach (var image in images)
                {
                    // Ensure a valid image
                    if (image.Length > 0)
                    {
                        // Upload image and save file path
                        var filePath = await _assetService.Upload(image);

                        // Extract and store the image file name
                        var fileName = Path.GetFileName(filePath);
                        imageNames.Add(fileName);
                    }
                }
            }
            assettDto.AssetImage = string.Join(",", imageNames);
            await _assetService.Insert(assettDto);
            return Ok();
        }

        //Get By Admin id assets
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdassets(int id)
        {
            var data = await _assetService.GetById(id);
            return Ok(data);
        }

        //Delete Assets
        [HttpDelete("deleteassets")]
        public async Task<IActionResult> DeleteUsers([FromBody] List<int> id)
        {
            if (id == null || !id.Any())
            {
                return BadRequest("No IDs provided.");
            }
            await _assetService.DeleteAssets(id);

            return Ok(new { Message = "asset deleted successfully." });
        }

        //Advance Filter Assets 
        [HttpGet("Filterdata")]
        public async Task<ActionResult<IEnumerable<AssetDto>>> GetUsers([FromQuery] FilterDto filter)
        {
            var assets = await _assetService.GetFilteredassets(filter);
            return Ok(assets);
        }
    }
}

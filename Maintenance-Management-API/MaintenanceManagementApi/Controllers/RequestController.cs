using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Bussiness.Service;
using MaintenanceManagementApi.Common.ViewModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;

namespace MaintenanceManagementApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class RequestController : ControllerBase
    {
        private readonly IRequestService _requestService;
        private readonly IGenericFilterService<WorkRequestWithStatusDto> _iGenericFilterService;

        public RequestController(IRequestService requestService, IGenericFilterService<WorkRequestWithStatusDto> iGenericFilterService)
        {
            _requestService = requestService;
            _iGenericFilterService = iGenericFilterService;
        }

        // Add new request
        [HttpPost]
        public async Task<IActionResult> AddRequest([FromForm] RequestDto requestDto, [FromForm] IFormFile[]? images)
        {
            if (requestDto == null)
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
                        var filePath = await _requestService.Upload(image);

                        // Extract and store the image file name
                        var fileName = Path.GetFileName(filePath);
                        imageNames.Add(fileName);
                    }
                }
            }
            requestDto.Image = string.Join(",", imageNames);
            await _requestService.Insert(requestDto);
            return Ok();
        }
        
        //Get By Requester id request
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdrequest(int id)
        {
            var data = await _requestService.GetById(id);
            return Ok(data);
        }

        //Get All Requester request
        [HttpGet]
        public async Task<IActionResult> GetAllrequest()
        {
            var data = await _requestService.GetAll();
            return Ok(data);
        }

        //Send Quotation 
        [HttpPost("sendEmail")]
        public async Task<IActionResult> SendEmail([FromBody] EmailPayloadDto emailPayload)
        {
            if (emailPayload == null || string.IsNullOrEmpty(emailPayload.Recipient) || string.IsNullOrEmpty(emailPayload.Body))
            {
                return BadRequest("Invalid email payload");
            }

            try
            {
                await _requestService.SendEmailAsync(emailPayload);
                return Ok();
            }
            catch (SmtpException ex)
            {
                // Handle email sending failure here
                return StatusCode(500, $"Email sending failed: {ex.Message}");
            }
        }
        
        //Accept quotation requester
        [HttpPut("acceptquotation")]
        public async Task<IActionResult> acceptquotation([FromQuery] int id)
        {
            var result = await _requestService.AcceptQuotation(id);

            if (result)
            {
                return Ok(new { message = "quotation accepted successfully." });
            }

            return NotFound(new { message = "quotation not found." });
        }
        
        //Delete work Request
        [HttpDelete("requestsdelete")]
        public async Task<IActionResult> DeleteWorkRequest([FromBody] List<int> id)
        {
            if (id == null || !id.Any())
            {
                return BadRequest("No IDs provided.");
            }
            var workRequest = await _requestService.Delete(id);

            if (workRequest == null)
            {
                return NotFound(); // Return 404 if the work request doesn't exist
            }

            return Ok();
        }

 
        //Decline customer request
        [HttpPost("decline")] // Use POST method
        public async Task<IActionResult> DeclineRequest([FromBody] DeclineRequestDto requestDto)
        {
            if (requestDto == null || string.IsNullOrEmpty(requestDto.DeclineReason))
            {
                return BadRequest("Invalid decline request.");
            }

            var result = await _requestService.DeclineRequest(requestDto.Id, requestDto.DeclineReason);

            if (result)
            {
                return Ok(new { message = "Request declined successfully." });
            }

            return NotFound(new { message = "Request not found." });
        }



        //Get requests By Admin
        [HttpGet("getrolebyadmin/{id}")]
        public async Task<IActionResult> GetByRoleIdrequest(int id)
        {
            var data = await _requestService.GetByRoleId(id);
            return Ok(data);
        }

        //Add Feedback by customer
        [HttpPost("Addfeedback")]
        public async Task<IActionResult> AddFeedback(CustomerFeedbackDto customerFeedbackDto)
        {
            var user = await _requestService.InsertCustomerFeedback(customerFeedbackDto);
            if (user == null)
            {
                return NotFound();
            }
            return Ok();
        }

        //Add Complaint by customer
        [HttpPost("Addcomplaint")]
        public async Task<IActionResult> AddComplaint([FromForm] ComplaintDto complaintDto, [FromForm] IFormFile[]? images)
        {
            // Validate the incoming data
            if (complaintDto == null)
            {
                return BadRequest("Complaint data is required.");
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
                        var filePath = await _requestService.Upload(image);

                        // Extract and store the image file name
                        var fileName = Path.GetFileName(filePath);
                        imageNames.Add(fileName);
                    }
                }
            }
            complaintDto.Attachment = string.Join(",", imageNames);
            await _requestService.InsertCustomercomplaint(complaintDto);
            return Ok();
        }

        //Get Complaint by customer
        [HttpGet("Getcomplaintcustomer/{id}")]
        public async Task<ActionResult<List<ComplaintDto>>> GetComplaintCutomer(int id)
        {
            var data = await _requestService.GetComplaintbycustomer(id);
            return Ok(data);
        }

        //Get Feedback By Admin
        [HttpGet("getfeedbackbyadmin/{id}")]
        public async Task<ActionResult<List<CustomerFeedbackDto>>> Getfeedbackbyadmin(int id)
        {
            var data = await _requestService.GetfeedById(id);
            return Ok(data);
        }

        //update complaint status
        [HttpPut("Updatecomplaintstatus/{id}")]
        public async Task<bool> Updatecomplaintstatus(int id,[FromBody] ComplaintDto request)
        {
            if (request.Status == null)
            {
                // Handle bad request
                return false; // Or throw an appropriate exception
            }
            var data = await _requestService.Updatecomplaintstatus(id, request.Status);
            return true;
        }

        //Get Feedback count
        [HttpGet("getfeedbackbyadmincount/{id}")]
        public async Task<ActionResult> Getfeedbackbyadmincount(int id)
        {
            var data = await _requestService.Getfeedbackcount(id);
            return Ok(data);
        }

        //Get Complaint count
        [HttpGet("Getcomplaintcustomercount/{id}")]
        public async Task<ActionResult> Getcomplaintcount(int id)
        {
            var data = await _requestService.Getcomplaintcount(id);
            return Ok(data);
        }

        //Get Request count
        [HttpGet("getrequestcount/{id}")]
        public async Task<ActionResult> Getrequestcount(int id)
         {
            var data = await _requestService.Getrequestcount(id);
            return Ok(data);
        }

        //Advance filter of the request 
        [HttpGet("FilterRequest")]
        public async Task<ActionResult<IEnumerable<WorkRequestWithStatusDto>>> GetWorkOrders([FromQuery] FilterDto filter)
        {
            var workrequest = await _iGenericFilterService.GetFilteredData(filter);
            return Ok(workrequest);
        }

    }
}


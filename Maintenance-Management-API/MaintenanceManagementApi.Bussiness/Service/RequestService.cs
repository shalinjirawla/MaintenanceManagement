using AutoMapper;
using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Data.IRepository;
using MaintenanceManagementApi.Data.Repository;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace MaintenanceManagementApi.Bussiness.Service
{
    public class RequestService : IRequestService
    {
        private readonly IRequestRepository _requestRepository;
        private readonly IMapper _mapper;
        private readonly string _uploadFolder;

        public RequestService(IRequestRepository requestRepository, IMapper mapper)
        {
            _requestRepository = requestRepository;
            _mapper = mapper;
            _uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Uploads");

        }

        // Add new request
        public async Task<int> Insert(RequestDto requestDto)
        {
            var data = _mapper.Map<WorkRequest>(requestDto);
            //  data.Password = BCrypt.Net.BCrypt.HashPassword(requestDto.Password);
            await _requestRepository.Insert(data);
            return data.Id;
        }

        //Get By Requester id request List
        public async Task<List<WorkRequestWithStatusDto>> GetById(int id)
        {
            var data = await _requestRepository.GetById(id);
            string baseUrl = "https://localhost:7025/wwwroot/Uploads/";
            var requestdata = _mapper.Map<List<WorkRequestWithStatusDto>>(data);

            foreach (var message in requestdata)
            {
                if (!string.IsNullOrEmpty(message.WorkRequest.Image))
                {
                    var imageNames = message.WorkRequest.Image.Split(',');
                    message.WorkRequest.Image = string.Join(",", imageNames.Select(name => $"{baseUrl}{name}"));
                }
            }
            return requestdata;

        }

        //Get All Requester request
        public async Task<List<WorkRequestWithStatusDto>> GetAll()
        {
            var data = await _requestRepository.GetAll();
            string baseUrl = "https://localhost:7025/wwwroot/Uploads/";
            var requestdata = _mapper.Map<List<WorkRequestWithStatusDto>>(data);

            foreach (var message in requestdata)
            {
                if (!string.IsNullOrEmpty(message.WorkRequest.Image))
                {
                    var imageNames = message.WorkRequest.Image.Split(',');
                    message.WorkRequest.Image = string.Join(",", imageNames.Select(name => $"{baseUrl}{name}"));
                }
            }
            return requestdata;
        }

        //Send Quotation 
        public async Task SendEmailAsync(EmailPayloadDto emailPayload)
        {
            var data = _mapper.Map<Quotation>(emailPayload);
            data.Status = 1;
            await _requestRepository.SendEmailAsync(data);
        }

        //Accept quotation requester
        public async Task<bool> AcceptQuotation(int id)
        {
            var data = await _requestRepository.AcceptQuotation(id);
            return data; // Assuming the repository returns a bool
        }

        //Delete work Request
        public async Task<bool> Delete(List<int> id)
        {
            await _requestRepository.DeleteRequest(id);
            return true; // Return true after attempting deletion
        }

        //Image upload
        public async Task<string> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("No file uploaded.");
            }
            var fileName = Path.GetFileName(file.FileName);
            var filePath = Path.Combine(_uploadFolder, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return fileName;

        }

        //Decline customer request
        public async Task<bool> DeclineRequest(int id, string declineReason)
        {
            await _requestRepository.DeclineRequest(id, declineReason);
            return true;
        }

        //Get requests By Admin
        public async Task<List<WorkRequestWithStatusDto>> GetByRoleId(int id)
        {
            var data = await _requestRepository.GetByRoleId(id);
            string baseUrl = "https://localhost:7025/wwwroot/Uploads/";
           // var requestdata = _mapper.Map<List<WorkRequestWithStatusDto>>(data);

            foreach (var message in data)
            {
                if (!string.IsNullOrEmpty(message.WorkRequest.Image))
                {
                    var imageNames = message.WorkRequest.Image.Split(',');
                    message.WorkRequest.Image = string.Join(",", imageNames.Select(name => $"{baseUrl}{name}"));
                }
            }
            return data;

        }

        //Add Feedback by customer
        public async Task<int> InsertCustomerFeedback(CustomerFeedbackDto customerFeedback)
        {
                var data=  _mapper.Map<CustomerFeedback>(customerFeedback);
                return await _requestRepository.AddcustomerFeedback(data); 
        }

        //Add Complaint by customer
        public async Task<int> InsertCustomercomplaint(ComplaintDto complaintDto)
        {
            var data = _mapper.Map<Complaint>(complaintDto);
            return await _requestRepository.Addcustomercomplaint(data);
        }

        //Get Complaint by admin
        public async Task<List<ComplaintDto>> GetComplaintbycustomer(int id)
        {
            var Complaintdata = await _requestRepository.GetComplaintbycustomer(id);
            string baseUrl = "https://localhost:7025/wwwroot/Uploads/";

            //var Complaintdata = _mapper.Map<List<ComplaintDto>>(data);
            foreach (var message in Complaintdata)
            {
                if (!string.IsNullOrEmpty(message.Attachment))
                {
                    var imageNames = message.Attachment.Split(',');
                    message.Attachment = string.Join(",", imageNames.Select(name => $"{baseUrl}{name}"));
                }
            }
            return Complaintdata;
        }

        //Get Feedback By Admin
        public async Task<List<CustomerFeedbackDto>> GetfeedById(int id)
        {
            var data = await _requestRepository.GetfeedbackById(id);
            return _mapper.Map<List<CustomerFeedbackDto>>(data);
        }

        //update complaint status
        public async Task<bool> Updatecomplaintstatus(int id, int status)
        {
            var data = await _requestRepository.Updatecomplaintstatus(id, status);
            return data != null;
        }

        //Get Feedback count
        public async Task<DashbordCountsDto> Getfeedbackcount(int id)
        {
            return  await _requestRepository.Getfeedbackcount(id);
            
        }

        //Get Complaint count
        public async Task<int> Getcomplaintcount(int id)
        {
            return await _requestRepository.Getcomplaintcount(id);
        }

        //Get Request count
        public async Task<DashbordCountsDto> Getrequestcount(int id)
        {
            return await _requestRepository.Getrequestcount(id);
        }


    }
}

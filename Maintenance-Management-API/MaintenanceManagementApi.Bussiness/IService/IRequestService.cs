using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.IService
{
    public interface IRequestService
    {
        // Add new request
        Task<int> Insert(RequestDto requestDto);

        //Get By Requester id request List
        Task<List<WorkRequestWithStatusDto>> GetById(int id);

        //Get All Requester request
        Task<List<WorkRequestWithStatusDto>> GetAll();

        //Send Quotation 
        Task SendEmailAsync(EmailPayloadDto emailPayload);

        //Accept quotation requester
        Task<bool> AcceptQuotation(int id);

        //Delete work Request
        Task<bool> Delete(List<int> id);

        //Image upload
        Task<string> Upload(IFormFile file);

        //Decline customer request
        Task<bool> DeclineRequest(int id, string declineReason);

        //Get requests By Admin
        Task<List<WorkRequestWithStatusDto>> GetByRoleId(int id);

        //Add Feedback by customer
        Task<int> InsertCustomerFeedback(CustomerFeedbackDto customerFeedback);

        //Add Complaint by customer
        Task<int> InsertCustomercomplaint(ComplaintDto complaintDto);

        //Get Complaint by customer
        Task<List<ComplaintDto>> GetComplaintbycustomer(int id);

        //Get Feedback By Admin
        Task<List<CustomerFeedbackDto>> GetfeedById(int id);

        //update complaint status
        Task<bool> Updatecomplaintstatus(int id,int status);

        //Get Feedback count
        Task<DashbordCountsDto> Getfeedbackcount(int id);

        //Get Complaint count
        Task<int> Getcomplaintcount(int id);

        //Get Request count
        Task<DashbordCountsDto> Getrequestcount(int id);
    }
}

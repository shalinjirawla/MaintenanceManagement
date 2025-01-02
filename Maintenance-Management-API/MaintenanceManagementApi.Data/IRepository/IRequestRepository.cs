using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Data.DBModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static MaintenanceManagementApi.Data.Repository.RequestRepository;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace MaintenanceManagementApi.Data.IRepository
{
    public interface IRequestRepository
    {
        // Add new Request
        Task<int> Insert(WorkRequest request);

        //Get By Requester id request
        Task<List<WorkRequestWithStatus>> GetById(int id);

        //Get All Requester request
        Task<List<WorkRequestWithStatus>> GetAll();

        //Send Quotation 
        Task<int> SendEmailAsync(Quotation data);

        //Accept quotation requester
        Task<bool> AcceptQuotation(int id);

        //Delete work Request
        Task<bool> DeleteRequest(List<int> id);

        //Decline customer request
        Task<bool> DeclineRequest(int id,string declineReason);

        //Get requests By Admin
        Task<List<WorkRequestWithStatusDto>> GetByRoleId(int id);

        //Add Feedback by customer
        Task<int> AddcustomerFeedback(CustomerFeedback customerFeedback);

        //Add Complaint by customer
        Task<int> Addcustomercomplaint(Complaint complaint);

        //Get Complaint by Admin
        Task<List<ComplaintDto>> GetComplaintbycustomer(int id);

        //Get Feedback By Admin
        Task<List<CustomerFeedback>> GetfeedbackById(int id);

        //update complaint status
        Task<bool> Updatecomplaintstatus(int id, int status);

        //Get Feedback count
        Task<DashbordCountsDto> Getfeedbackcount(int id);

        //Get Complaint count
        Task<int> Getcomplaintcount(int id);

        //Get Request count
        Task<DashbordCountsDto> Getrequestcount(int id);    
    }

}

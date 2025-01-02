using MaintenanceManagementApi.Data.DataDbContext;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Data.IRepository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Azure.Core;
using System.Threading;
using MaintenanceManagementApi.Common.ViewModel;

namespace MaintenanceManagementApi.Data.Repository
{
    public class RequestRepository : IRequestRepository
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public RequestRepository(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Register New User
        public async Task<int> Insert(WorkRequest request)
        {
            await _context.WorkRequests.AddAsync(request);
            _context.SaveChanges();
            return request.Id;
        }

        //Get By Requester id request
        public async Task<List<WorkRequestWithStatus>> GetById(int id)
        {
            //return await _context.WorkRequests.Where(w => w.CreatedBy == id).ToListAsync();
            return await (from w in _context.WorkRequests
                          where w.CreatedBy == id
                          join q in _context.Quotations on w.Id equals q.RequestId into quotations
                          from q in quotations.DefaultIfEmpty() // Left join
                          join u in _context.Users on w.CreatedBy equals u.UserID
                          select new WorkRequestWithStatus
                          {
                              WorkRequest = w,
                              Status = q.Status, // This can be null if there is no matching quotation
                              Body = q.Body,
                              CreatedByUser = new User
                              {
                                  Username = u.Username,
                                  Email = u.Email
                              }
                          }).ToListAsync();

        }

        //Get All Requester request
        public async Task<List<WorkRequestWithStatus>> GetAll()
        {
            var result = await (from w in _context.WorkRequests
                                join q in _context.Quotations on w.Id equals q.RequestId into quotations
                                from q in quotations.DefaultIfEmpty() // Left join
                                join u in _context.Users on w.CreatedBy equals u.UserID
                                select new WorkRequestWithStatus
                                {
                                    WorkRequest = w,
                                    Status = q.Status,
                                    Body = q.Body,
                                    CreatedByUser = new User
                                    {
                                        Username = u.Username,
                                        Email = u.Email
                                    }
                                }).ToListAsync();

            return result;
        }

        //Send Quotation 
        public async Task<int> SendEmailAsync(Quotation data)
        {
            try
            {
                await _context.Quotations.AddAsync(data);
                await _context.SaveChangesAsync();
                var reqid = await _context.WorkRequests.FirstOrDefaultAsync(q => q.Id == data.RequestId);

                if (reqid != null && !string.IsNullOrEmpty(data.Body))
                {
                    // Use a regex to extract the numeric value after "Estimated Cost:"
                    var match = System.Text.RegularExpressions.Regex.Match(data.Body, @"Estimated Cost:\s*(\d+(\.\d+)?)");

                    if (match.Success && decimal.TryParse(match.Groups[1].Value, out var estimatedCost))
                    {
                        reqid.EstimatedCost = estimatedCost;
                    }
                }

                // Save changes to the database
                await _context.SaveChangesAsync();

                return data.Id;

                //var smtpSettings = _configuration.GetSection("SmtpSettings");
                //var smtpClient = new SmtpClient
                //{
                //    Host = smtpSettings["Host"],
                //    Port = int.Parse(smtpSettings["Port"]),
                //    EnableSsl = bool.Parse(smtpSettings["EnableSsl"]),
                //    Credentials = new NetworkCredential(smtpSettings["Username"], smtpSettings["Password"])
                //};

                //var mailMessage = new MailMessage(sender, recipient, subject, body)
                //{
                //    IsBodyHtml = false
                //};

                //await smtpClient.SendMailAsync(mailMessage);
            }
            //catch (SmtpException smtpEx)
            //{
            //    // Handle errors related to the SMTP client
            //    // Log the exception or return an error message
            //    Console.WriteLine($"SMTP Exception: {smtpEx.Message}");
            //    throw new Exception("Failed to send email. Please check the SMTP settings.");
            //}
            catch (Exception ex)
            {
                // Handle other potential exceptions
                Console.WriteLine($"General Exception: {ex.Message}");
                throw new Exception("An error occurred while sending the email.");
            }
        }

        //Accept quotation requester
        public async Task<bool> AcceptQuotation(int id)
        {
            // Assuming your repository method implements logic similar to what you initially shared
            var quotation = await _context.Quotations.FirstOrDefaultAsync(q => q.RequestId == id);

            if (quotation == null)
            {
                return false;
            }

            quotation.Status = 2;
            await _context.SaveChangesAsync();

            return true;
        }

        //delete work request
        public async Task<bool> DeleteRequest(List<int> id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            // Fetch related quotations for the provided Work Request IDs
            var quotations = await _context.Quotations.Where(q => id.Contains(q.RequestId)).ToListAsync();

            if (quotations.Any())
            {
                _context.Quotations.RemoveRange(quotations); // Remove related quotations
            }

            // Fetch the Work Requests to delete
            var workRequests = await _context.WorkRequests.Where(wr => id.Contains(wr.Id)).ToListAsync();

            if (!workRequests.Any())
            {
                return false; // No records found to delete
            }

            _context.WorkRequests.RemoveRange(workRequests); // Remove Work Requests
            await _context.SaveChangesAsync(); // Save changes
            await transaction.CommitAsync(); // Commit transaction

            return true;
        }

        //Decline customer request
        public async Task<bool> DeclineRequest(int id, string declineReason)
        {
            var data = await _context.WorkRequests.FirstOrDefaultAsync(r => r.Id == id);
            if (data != null)
            {
                data.Status = "Declined";
                data.Comment = declineReason;
                _context.WorkRequests.Update(data);
                await _context.SaveChangesAsync();
            }
            return true;
        }

        
        //Get requests By Admin
        public async Task<List<WorkRequestWithStatusDto>> GetByRoleId(int id)
        {
            //return await _context.WorkRequests.Where(w => w.CreatedBy == id).ToListAsync();
            return await (from w in _context.WorkRequests
                          where w.HadAdminId == id && w.Status != "Approved"
                          join q in _context.Quotations on w.Id equals q.RequestId into quotations
                          from q in quotations.DefaultIfEmpty() // Left join
                          join u in _context.Users on w.CreatedBy equals u.UserID
                          select new WorkRequestWithStatusDto
                          {
                              WorkRequest = new WorkRequestDto
                              {
                                  Id = w.Id,
                                  Title = w.Title,
                                  Description = w.Description,
                                  Priority = w.Priority,
                                  Image = w.Image,
                                  Status = w.Status,
                                  CreatedBy = w.CreatedBy,
                                  CreatedDate = w.CreatedDate,
                                  EstimatedCost = w.EstimatedCost,
                                  Location = w.Location,                                 

                              },
                              Status = q.Status, // This can be null if there is no matching quotation
                              Body = q.Body,
                              CreatedByUser = new UserDto
                              {
                                  Username = u.Username,
                                  Email = u.Email
                              }
                          }).ToListAsync();

        }

        //Add Feedback by customer
        public async Task<int> AddcustomerFeedback(CustomerFeedback customerFeedback)
        {

            await _context.CustomerFeedbacks.AddAsync(customerFeedback);
            await _context.SaveChangesAsync(); // Save changes to generate the ID
            return customerFeedback.Id; // Now you can access the Id


        }


        //Add Complaint by customer
        public async Task<int> Addcustomercomplaint(Complaint complaint)
        {
            await _context.Complaints.AddAsync(complaint);
            await _context.SaveChangesAsync(); // Save changes to generate the ID
            return complaint.Id; // Now you can access the Id
        }

        //Get Complaint by Admin
        public async Task<List<ComplaintDto>> GetComplaintbycustomer(int id)
        {
            var complaintsQuery = _context.Complaints.AsQueryable();
            if (id != 1)
            {
                // Filter complaints where CustomerID matches or HadAdminId is the same as the provided id
                complaintsQuery = complaintsQuery.Where(co => co.CustomerID == id ||
                                                             _context.Users.Any(user => user.HadAdminId == id && user.UserID == co.CustomerID));
            }
            else
            {
                // For id == 1, no additional filter for HadAdminId
                // complaintsQuery = complaintsQuery.Where(co => co.CustomerID == id);
            }
            var complaints = await (from co in complaintsQuery
                                    join w in _context.WorkOrders on co.WorkRequestID equals w.RequestedId
                                    select new ComplaintDto
                                    {
                                        Id = co.Id,
                                        CustomerID = co.CustomerID,
                                        WorkRequestID = co.WorkRequestID,
                                        Title = co.Title,
                                        Description = co.Description,
                                        Priority = co.Priority,
                                        Category = w.Category,
                                        Location = w.Location,
                                        Asset = w.Asset,
                                        Status = co.Status,
                                        ComplaintDate = co.ComplaintDate,
                                        Attachment = co.Attachment,
                                    }).ToListAsync();

            return complaints;
        }

        //Get Feedback By Admin
        public async Task<List<CustomerFeedback>> GetfeedbackById(int id)
        {
            var query = id == 1
        ? _context.CustomerFeedbacks
        : _context.CustomerFeedbacks.Where(feedback => _context.Users.Any(user => user.HadAdminId == id && user.UserID == feedback.CustomerID));

            return await query.ToListAsync();
            //var feedbacks = await _context.CustomerFeedbacks
            //.Where(feedback => _context.Users.Any(user => user.HadAdminId == id && user.UserID == feedback.CustomerID))
            //.ToListAsync();

        }

        //update complaint status
        public async Task<bool> Updatecomplaintstatus(int id, int status)
        {
            var data = await _context.Complaints.FirstOrDefaultAsync(c => c.Id == id);
            if (data == null) return false;

            data.Status = status;

            _context.Update(data);
            _context.SaveChangesAsync();
            return true;
        }

        //Get Feedback count
        public async Task<DashbordCountsDto> Getfeedbackcount(int id)
        {
            var query = _context.CustomerFeedbacks.AsQueryable();
            if (id != 1)
            {
                var users = await _context.Users
                    .Where(user => user.HadAdminId == id)
                    .Select(user => user.UserID)
                    .ToListAsync();

                query = query.Where(feedback => users.Contains(feedback.CustomerID));
            }

            var totalCount = await query.CountAsync();
            var satisfiedCount = await query.Where(feedback => feedback.Satisfied != "Dissatisfied").CountAsync();

            return new DashbordCountsDto
            {
                TotalCount = totalCount,
                CountingCount = satisfiedCount
            };

        }

        //Get Complaint count
        public async Task<int> Getcomplaintcount(int id)
        {
            var query = _context.Complaints.AsQueryable();

            if (id != 1)
            {
                var users = await _context.Users
                    .Where(user => user.HadAdminId == id).Select(user => user.UserID)
                    .ToListAsync();

                query = query.Where(complaint => users.Contains(complaint.CustomerID));
            }

            return await query.CountAsync();

        }

        //Get Request count
        public async Task<DashbordCountsDto> Getrequestcount(int id)
        {
            var query = id == 1 ? _context.WorkRequests : _context.WorkRequests.Where(r => r.HadAdminId == id && r.Status != "Approved");

            var totalCount = await query.CountAsync();
            var pendingCount = await query.Where(r => r.Status == "Pending").CountAsync();

            return new DashbordCountsDto
            {
                TotalCount = totalCount,
                CountingCount = pendingCount
            };

        }

    }
}

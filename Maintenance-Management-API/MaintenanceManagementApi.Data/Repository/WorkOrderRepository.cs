using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DataDbContext;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Data.IRepository;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.Repository
{
    public class WorkOrderRepository : IWorkOrderRepository
    {
        private readonly AppDbContext _context;

        public WorkOrderRepository(AppDbContext context)
        {
            _context = context;
        }

        // Register New Work Order
        public async Task<int> Insert(WorkOrder workorder)
        {
            try
            {
                // Ensure the DbContext is not disposed prematurely and scoped properly
                var data = _context.WorkRequests
                                         .FirstOrDefault(r => r.Id == workorder.RequestedId);

                if (data != null)
                {
                    // Update the status of the WorkRequest
                    data.Status = "Approved";
                    _context.WorkRequests.Update(data);
                }

                // Add the new WorkOrder to the context
                await _context.WorkOrders.AddAsync(workorder);

                // Save all changes (both WorkRequest update and WorkOrder insert)
                _context.SaveChanges();

                return workorder.Id;
            }
            catch (DbUpdateException dbEx)
            {
                // Handle database update exceptions (e.g., constraint violations)
                Console.WriteLine($"Database Update Error: {dbEx.Message}");
                throw;
            }
            catch (Exception ex)
            {
                // Catch any other general exceptions
                Console.WriteLine($"An error occurred: {ex.Message}");
                throw;
            }
        }

        //Delete work order
        public async Task<bool> Delete(List<int> id)
        {
            var wodata = await _context.WorkOrders.Where(a => id.Contains(a.Id)).ToListAsync();
            if (!wodata.Any())
            {
                return false;
            }

            _context.WorkOrders.RemoveRange(wodata);  // Remove the work order from the context
            await _context.SaveChangesAsync(); // Commit the changes to the database
            return true; // Deletion was successful           


        }

        //Get All WorkOrder
        public async Task<List<WorkOrderDto>> GetAll()
        {
            // return await _context.WorkOrders.Include(u => u.AssignedToUser).ToListAsync();

            var combinedWorkOrders = await (from wo in _context.WorkOrders
                                            join a in _context.Users on wo.AssignedTo equals a.UserID
                                            join r in _context.WorkRequests on wo.RequestedId equals r.Id into workRequestJoin
                                            from r in workRequestJoin.DefaultIfEmpty()
                                            join u in _context.Users on r.CreatedBy equals u.UserID into userJoin
                                            from u in userJoin.DefaultIfEmpty()
                                            join p in _context.Payments on wo.Id equals p.WorkorderId into paymentJoin
                                            from p in paymentJoin.DefaultIfEmpty()
                                            join b in _context.Users on wo.RequestedId equals b.UserID into requestedUserJoin
                                            from b in requestedUserJoin.DefaultIfEmpty()
                                            select new WorkOrderDto
                                            {
                                                Id = wo.Id,
                                                Title = wo.Title,
                                                Description = wo.Description,
                                                DueDate = wo.DueDate,
                                                StartDate = wo.StartDate,
                                                Status = wo.Status,
                                                Priority = wo.Priority,
                                                Category = wo.Category,
                                                Location = wo.Location,
                                                Asset = wo.Asset,
                                                AssignedTo = wo.AssignedTo,
                                                AssignedToUser = a.Username,
                                                RequestedToUser = u != null ? u.Username : b.Username,
                                                Payment = p != null ? p.Status : null
                                            }).ToListAsync();

            return combinedWorkOrders;


        }

        // Get WorkOrder By Role
        public async Task<List<WorkOrderDto>> GetWorkOrderByRoleId(int id, string role)
        {
            var combinedWorkOrders = await (
              from wo in _context.WorkOrders
              join a in _context.Users on wo.AssignedTo equals a.UserID
              join r in _context.WorkRequests on wo.RequestedId equals r.Id into workRequestJoin
              from r in workRequestJoin.DefaultIfEmpty()
              join u in _context.Users on r.CreatedBy equals u.UserID into userJoin
              from u in userJoin.DefaultIfEmpty()
              join b in _context.Users on wo.RequestedId equals b.UserID into requestedUserJoin
              from b in requestedUserJoin.DefaultIfEmpty()
              join loc in _context.Locations on Convert.ToInt32(wo.Location) equals loc.Id into locationJoin
              from loc in locationJoin.DefaultIfEmpty()
              join p in _context.Payments on wo.Id equals p.WorkorderId into paymentJoin
              from p in paymentJoin.DefaultIfEmpty()
              where (role == "Admin" ? (u != null && u.HadAdminId == id) || wo.RequestedId == id : wo.AssignedTo == id)
              select new WorkOrderDto
              {
                  Id = wo.Id,
                  Title = wo.Title,
                  Description = wo.Description,
                  DueDate = wo.DueDate,
                  StartDate = wo.StartDate,
                  Status = wo.Status,
                  Priority = wo.Priority,
                  Category = wo.Category,
                  LocationName = loc != null ? loc.Description : null,
                  Location = wo.Location,
                  Asset = wo.Asset,
                  AssignedTo = wo.AssignedTo,
                  AssignedToUser = a.Username,
                  RequestedToUser = u.Username ?? b.Username,
                  EstimatedCost=r.EstimatedCost,
                  EmailCustomer=u.Email??b.Email,
                  RequestedId=wo.RequestedId,
                  Payment= p != null ? p.Status : null,
                  Comment=wo.Comment,   

              }).ToListAsync();

            return combinedWorkOrders;

        }

        //Update WorkOrder Status
        public async Task<int> UpdateStatus(WorkOrder workorder)
        {
            var data = await _context.WorkOrders.FirstOrDefaultAsync(w => w.Id == workorder.Id);
            if (data != null)
            {
                data.Status = workorder.Status;
                _context.WorkOrders.Update(data);
                await _context.SaveChangesAsync();
                return data.Id;
            }
            return workorder.Id;
        }

        //Update WorkOrder 
        public async Task<int> Update(WorkOrder workorder)
        {
            var data = await _context.WorkOrders.FirstOrDefaultAsync(w => w.Id == workorder.Id);
            if (data != null)
            {

                data.AssignedTo = workorder.AssignedTo;
                data.StartDate = workorder.StartDate;
                data.DueDate = workorder.DueDate;
                data.Category = workorder.Category;
                data.Asset = workorder.Asset;
                data.Location = workorder.Location;

                _context.WorkOrders.Update(data);
                await _context.SaveChangesAsync();
                return data.Id;
            }
            return workorder.Id;
        }

        //Advance Filter Workorder
        public async Task<IEnumerable<WorkOrder>> GetFilteredWorkOrders(FilterDto filter)
        {
            var query = _context.WorkOrders.AsQueryable();

            if (filter.Id.HasValue) // Check if Id has a value
            {
                query = query.Where(w => w.Id == filter.Id.Value); // Use equality for filtering
            }
            if (!string.IsNullOrEmpty(filter.Title))
            {
                query = query.Where(w => w.Title.Contains(filter.Title));
            }
            if (!string.IsNullOrEmpty(filter.Status))
            {
                query = query.Where(w => w.Status == filter.Status);
            }
            // Process DueDate
            if (!string.IsNullOrEmpty(filter.DueDate))
            {
                // Try parsing full date
                if (DateTime.TryParse(filter.DueDate, out DateTime dueDateValue))
                {
                    query = query.Where(w => w.DueDate.Date == dueDateValue.Date);
                }
            }
            if (!string.IsNullOrEmpty(filter.StartDate))
            {
                if (DateTime.TryParse(filter.StartDate, out DateTime startDateValue))
                {
                    query = query.Where(w => w.StartDate.Date == startDateValue.Date);
                }
            }

            if (!string.IsNullOrEmpty(filter.Priority))
            {
                query = query.Where(w => w.Priority == filter.Priority);
            }
            if (!string.IsNullOrEmpty(filter.AssignedTo))
            {
                // Find the user ID based on the provided username
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == filter.AssignedTo);

                if (user != null)
                {
                    // Filter WorkOrders by the found user ID
                    query = query.Where(w => w.AssignedTo == user.UserID);
                }
            }

            return await query.ToListAsync();
        }

        // Complate workorder
        public async Task<int> Insertcomplateworkorder(CompletedWorkOrder completedWorkOrder)
        {
            var exist = await _context.CompletedWorkOrders
                              .FirstOrDefaultAsync(c => c.WorkOrderId == completedWorkOrder.WorkOrderId);

            if (exist == null)
            {
                await _context.CompletedWorkOrders.AddAsync(completedWorkOrder);
                await _context.SaveChangesAsync();  // Save changes to get the generated ID
                return completedWorkOrder.Id;
            }
            else
            {
                exist.Status = completedWorkOrder.Status;
                exist.PlanDeviations = completedWorkOrder.PlanDeviations;
                exist.NotesComments = completedWorkOrder.NotesComments;
                exist.ProofOfCompletion = completedWorkOrder.ProofOfCompletion;
                exist.AdminReviewStatus = completedWorkOrder.AdminReviewStatus;
                exist.DescriptionOfOccurrence = completedWorkOrder.DescriptionOfOccurrence;
                exist.ChallengesEncountered = completedWorkOrder.ChallengesEncountered;
                exist.SparePartsMaterialsUsed = completedWorkOrder.SparePartsMaterialsUsed;
                exist.ExtraWorkDetails = completedWorkOrder.ExtraWorkDetails;
                exist.PlanDeviations = completedWorkOrder.PlanDeviations;
                exist.ActualLaborHours = completedWorkOrder.ActualLaborHours;
                exist.WorkHours = completedWorkOrder.WorkHours;

                _context.CompletedWorkOrders.Update(exist);
                await _context.SaveChangesAsync();  // Save changes to commit the update
                return exist.Id;
            }

        }

        // Maintenance Items used
        public async Task<int> InsertMaintananceItems(MaintenanceItem maintenanceItem)
        {
             await _context.MaintenanceItems.AddAsync(maintenanceItem);
             var inventory = _context.InventoryItems
                .FirstOrDefault(item => item.Id == maintenanceItem.InventoryItemId);
            inventory.AvailableQuantity = (inventory.AvailableQuantity - maintenanceItem.Quantity);
            inventory.OnHandQuantity = (inventory.OnHandQuantity - maintenanceItem.Quantity);

            _context.SaveChanges();
            return maintenanceItem.Id;
        }

        // review workorder
        public async Task<CompletedWorkOrder> GetReviewdata(int id)
        {
            var data = await _context.CompletedWorkOrders.FirstOrDefaultAsync(w => w.WorkOrderId == id);
            return data;

        }

        // get previous assign workorder employee
        public async Task<int> GetPreviousassignemployee(int id)
        {
            return _context.WorkOrders.Where(w => w.RequestedId == id).Select(w => w.AssignedTo).FirstOrDefault();
        }

        //Get workorder count
        public async Task<DashbordCountsDto> Getworkordercount(int id)
        {
            var query = _context.WorkOrders.AsQueryable();

            if (id != 1)
            {
                query = query.Where(wo => _context.Users.Any(user => user.UserID == wo.AssignedTo && user.HadAdminId == id));
            }

            var totalCount = await query.CountAsync();
            var completeCount = await query.Where(wo => wo.Status == "Complete").CountAsync();

            return new DashbordCountsDto
            {
                TotalCount = totalCount,
                CountingCount = completeCount
            };
        }

        //Get workorder Payment complete
        public async Task<DashbordCountsDto> Getpaymentcount(int id)
        {
            var query = _context.WorkOrders.AsQueryable();

            if (id != 1)
            {
                query = query.Where(wo => _context.Users.Any(user => user.UserID == wo.AssignedTo && user.HadAdminId == id));
            }
            var completepayment = await query.Where(wo => wo.Status == "Complete").CountAsync();
            var pendingpayment = await query
       .Where(wo => wo.Status == "Complete" &&
           !_context.Payments.Any(p => p.WorkorderId == wo.Id)) // Check if no payment record exists for the work order
       .CountAsync();

            return new DashbordCountsDto
            {
                TotalCount = completepayment-pendingpayment,
                CountingCount = pendingpayment
            };
        }
    }
}

using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DataDbContext;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Data.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace MaintenanceManagementApi.Data.Repository
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly AppDbContext _context;

        public GenericRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<List<T>> GetFilteredDataAsync(FilterDto filter)
        {
            var query = _context.Set<T>().AsQueryable();

            // Example for Location filter
            if (typeof(T) == typeof(Location))
            {
                if (filter.Id != null)
                {
                    query = query.Where(e => EF.Property<int>(e, "HadAdmin") == filter.Id);
                }
                if (!string.IsNullOrEmpty(filter.Name))
                {
                    query = query.Where(e => EF.Property<string>(e, "Name").Contains(filter.Name));
                }
                if (!string.IsNullOrEmpty(filter.Description))
                {
                    query = query.Where(e => EF.Property<string>(e, "Description") == filter.Description);
                }
                if (!string.IsNullOrEmpty(filter.Status))
                {
                    int status = filter.Status == "Active" ? 1 : filter.Status == "Inactive" ? 0 : -1;
                    if (status != -1)
                    {
                        query = query.Where(e => EF.Property<int>(e, "Status") == status);
                    }
                }
            }
            else if (typeof(T) == typeof(Asset))
            {
                if (filter.Id != null)
                {
                    query = query.Where(e => EF.Property<int>(e, "Hadadmin") == filter.Id);
                }

                if (!string.IsNullOrEmpty(filter.AssetName))
                {
                    query = query.Where(e => EF.Property<string>(e, "AssetName") == filter.AssetName);
                }
                if (!string.IsNullOrEmpty(filter.Model))
                {
                    query = query.Where(e => EF.Property<string>(e, "Model") == filter.Model);
                }
                if (!string.IsNullOrEmpty(filter.SerialNumber))
                {
                    query = query.Where(e => EF.Property<string>(e, "SerialNumber") == filter.SerialNumber);
                }
                if (!string.IsNullOrEmpty(filter.Category))
                {
                    query = query.Where(e => EF.Property<string>(e, "Category") == filter.Category);
                }
            }           
            else if (typeof(T) == typeof(Vendor))
            {               

                // Apply filters for Vendor entity
                if (filter.Id != null)
                {
                    query = query.Where(e => EF.Property<int>(e, "HadAdminId") == filter.Id);
                }
                if (!string.IsNullOrEmpty(filter.Name))
                {
                    query = query.Where(e => EF.Property<string>(e, "Name")==filter.Name);
                }
                if (!string.IsNullOrEmpty(filter.Companyname))
                {
                    query = query.Where(e => EF.Property<string>(e, "CompanyName") == filter.Companyname);
                }
                if (!string.IsNullOrEmpty(filter.Contact))
                {
                    query = query.Where(e => EF.Property<string>(e, "ContactNumber") == filter.Contact);
                }
                if (!string.IsNullOrEmpty(filter.Email))
                {
                    query = query.Where(e => EF.Property<string>(e, "Email") == filter.Email);
                }
                if (!string.IsNullOrEmpty(filter.Username))
                {
                    query = query.Where(e => EF.Property<string>(e, "ContactPerson") == filter.Username);
                }
              
            }
            else if (typeof(T) == typeof(InventoryCategory))
            {               

                // Filter by admin ID.
                if (filter.Id != null)  // Assuming Id is nullable in FilterDto
                {
                    query = query.Where(e => EF.Property<int>(e, "HadAdminId") == filter.Id);
                }

                if (!string.IsNullOrEmpty(filter.Name))
                {
                    query = query.Where(e => EF.Property<string>(e, "CategoryName")==filter.Name);
                }
                if (!string.IsNullOrEmpty(filter.Description))
                {
                    query = query.Where(e => EF.Property<string>(e, "Description") == filter.Description);

                }               
            }
            else if (typeof(T) == typeof(WorkOrderDto))
            {
                var workOrderQuery = from wo in _context.WorkOrders
                                     join a in _context.Users on wo.AssignedTo equals a.UserID
                                     join p in _context.Payments on wo.Id equals p.WorkorderId into paymentJoin
                                     from p in paymentJoin.DefaultIfEmpty()
                                     where (a.HadAdminId == filter.Id)
                                     select new WorkOrderDto
                                     {
                                         Id = wo.Id,
                                         Title = wo.Title,
                                         DueDate = wo.DueDate,
                                         Priority = wo.Priority,
                                         AssignedToUser = a.Username,
                                         Status = wo.Status,
                                         Payment = p != null ? p.Status : null,
                                     };
                if (filter.WorkorderId != null)
                {
                    workOrderQuery = workOrderQuery.Where(wo => wo.Id == filter.WorkorderId);
                }
                if (!string.IsNullOrEmpty(filter.Title))
                {
                    workOrderQuery = workOrderQuery.Where(wo => wo.Title == filter.Title);
                }
                if (!string.IsNullOrEmpty(filter.Status))
                {
                    workOrderQuery = workOrderQuery.Where(wo => wo.Status == filter.Status);
                }

                if (!string.IsNullOrEmpty(filter.DueDate))
                {
                    if (DateTime.TryParse(filter.DueDate, out DateTime dueDateValue))
                    {
                        workOrderQuery = workOrderQuery.Where(wo =>
                            EF.Functions.DateDiffDay(wo.DueDate, dueDateValue) == 0);
                    }
                }

                if (!string.IsNullOrEmpty(filter.Priority))
                {
                    workOrderQuery = workOrderQuery.Where(wo => wo.Priority == filter.Priority);
                }
                if (!string.IsNullOrEmpty(filter.AssignedTo))
                {
                    var user = await _context.Users
                        .FirstOrDefaultAsync(u => u.Username == filter.AssignedTo);

                    if (user != null)
                    {
                        workOrderQuery = workOrderQuery.Where(wo => wo.AssignedTo == user.UserID);
                    }
                }

                return await workOrderQuery.ToListAsync() as List<T>;
            }
            else if (typeof(T) == typeof(PreventiveMaintenanceDto))
            {
                var pmquery = from pm in _context.PreventiveMaintenances
                              join asset in _context.Assets on pm.Asset equals asset.Id
                              join user in _context.Users on pm.AssignTo equals user.UserID
                              join schedule in _context.PMSchedules on pm.Id equals schedule.PMId
                              where true // Ensure the query doesn't filter out all results unintentionally
                              select new PreventiveMaintenanceDto
                              {
                                  Id = pm.Id,
                                  Title = pm.Title,
                                  AssetName = asset.AssetName,
                                  Category = pm.Category,
                                  Priority = pm.Priority,
                                  AssignToName = user.Username,
                                  ScheduleType = schedule.ScheduleType,
                                  Asset = pm.Asset,
                                  AssignTo = pm.AssignTo,
                                  CreatedBy = pm.CreatedBy,
                              };

                // Apply filters based on the input
                if (filter.Id.HasValue)
                {
                    pmquery = pmquery.Where(w => w.CreatedBy == filter.Id.Value);
                }
                if (!string.IsNullOrEmpty(filter.Name))
                {
                    pmquery = pmquery.Where(w => w.Title.Contains(filter.Name));
                }
                if (!string.IsNullOrEmpty(filter.ScheduleType))
                {
                    pmquery = pmquery.Where(w => w.ScheduleType.Contains(filter.ScheduleType));
                }
                if (!string.IsNullOrEmpty(filter.AssetName))
                {
                    var asset = await _context.Assets
                        .FirstOrDefaultAsync(a => a.AssetName == filter.AssetName);

                    if (asset != null)
                    {
                        pmquery = pmquery.Where(w => w.Asset == asset.Id);
                    }
                }
                if (!string.IsNullOrEmpty(filter.AssignedTo))
                {
                    var user = await _context.Users
                        .FirstOrDefaultAsync(u => u.Username == filter.AssignedTo);

                    if (user != null)
                    {
                        pmquery = pmquery.Where(w => w.AssignTo == user.UserID);
                    }
                }
                if (!string.IsNullOrEmpty(filter.Priority))
                {
                    pmquery = pmquery.Where(w => w.Priority == filter.Priority);
                }
                if (!string.IsNullOrEmpty(filter.Category))
                {
                    pmquery = pmquery.Where(w => w.Category == filter.Category);
                }

                return await pmquery.ToListAsync() as List<T>;

            }
            else if (typeof(T) == typeof(WorkRequestWithStatus))
            {
                var querys = from w in _context.WorkRequests
                             join q in _context.Quotations on w.Id equals q.RequestId into quotations
                             from q in quotations.DefaultIfEmpty() // Left join
                             join u in _context.Users on w.CreatedBy equals u.UserID
                             where(w.Status!= "Approved")
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
                             };
                if (filter.CreatedBy.HasValue) // Check if Id has a value
                {
                    querys = querys.Where(w => w.WorkRequest.CreatedBy == filter.CreatedBy.Value); // Use equality for filtering
                }
                if (filter.Id.HasValue) // Check if Id has a value
                {
                    querys = querys.Where(w => w.WorkRequest.HadAdminId == filter.Id.Value); // Use equality for filtering
                }

                if (!string.IsNullOrEmpty(filter.Title))
                {
                    querys = querys.Where(w => w.WorkRequest.Title.Contains(filter.Title));
                }
                if (!string.IsNullOrEmpty(filter.Priority))
                {
                    querys = querys.Where(w => w.WorkRequest.Priority == filter.Priority);
                }
                if (!string.IsNullOrEmpty(filter.Status))
                {
                    querys = querys.Where(w => w.WorkRequest.Status == filter.Status);
                }
                // Process DueDate
                if (!string.IsNullOrEmpty(filter.CreatedDate))
                {
                    // Try parsing full date
                    if (DateTime.TryParse(filter.CreatedDate, out DateTime dueDateValue))
                    {
                        querys = querys.Where(w => w.WorkRequest.CreatedDate.Date == dueDateValue.Date);
                    }
                }
                if (!string.IsNullOrEmpty(filter.Username))
                {
                    // Find the user ID based on the provided username
                    var user = await _context.Users
                        .FirstOrDefaultAsync(u => u.Username == filter.Username);

                    if (user != null)
                    {
                        // Filter WorkOrders by the found user ID
                        querys = querys.Where(w => w.WorkRequest.CreatedBy == user.UserID);
                    }
                }

                return await querys.ToListAsync() as List<T>;
                
            }
            else if (typeof(T) == typeof(InventoryItem))
            {
                var querys = _context.InventoryItems
                        .Include(item => item.InventoryCategory) // Include the related category
                        .AsQueryable();

                // Filter by admin ID.
                if (filter.Id != null)  // Assuming Id is nullable in FilterDto
                {
                    querys = querys.Where(item => item.HadAdminId == filter.Id);
                }

                if (!string.IsNullOrEmpty(filter.Name))
                {
                    querys = querys.Where(w => w.Name.Contains(filter.Name));
                }
                if (!string.IsNullOrEmpty(filter.Sku))
                {
                    querys = querys.Where(w => w.SKU == filter.Sku);
                }
                if (!string.IsNullOrEmpty(filter.Unit))
                {
                    querys = querys.Where(w => w.Unit == filter.Unit);
                }
                if (!string.IsNullOrEmpty(filter.Category))
                {
                    querys = querys.Where(w => w.InventoryCategory.CategoryName == filter.Category);
                }
                if (!string.IsNullOrEmpty(filter.Status))
                {
                    querys = querys.Where(w => w.Status == filter.Status);
                }

                return await querys.ToListAsync() as List<T>;
            }
            else if (typeof(T) == typeof(PurchaseOrderListDto))
            {
                var querys = _context.PurchaseOrders.AsQueryable();

                // Filter by admin ID.
                if (filter.Id != null)  // Assuming Id is nullable in FilterDto
                {
                    querys = querys.Where(item => item.CreatedBy == filter.Id);
                }

                if (!string.IsNullOrEmpty(filter.Title))
                {
                    querys = querys.Where(w => w.Title.Contains(filter.Title));
                }
                if (!string.IsNullOrEmpty(filter.Ponumber))
                {
                    querys = querys.Where(w => w.OrderNumber == filter.Ponumber);
                }
                if (!string.IsNullOrEmpty(filter.Vendor))
                {
                    var vendorId = _context.Vendors
                              .Where(v => v.Name == filter.Vendor)
                              .Select(v => v.Id)
                              .FirstOrDefault();

                    // Agar vendorId null ya default nahi hai, to filter apply karein
                    if (vendorId != default)
                    {
                        querys = querys.Where(w => w.VendorId == vendorId);
                    }
                }
                if (!string.IsNullOrEmpty(filter.CreatedDate))
                {
                    // Try parsing full date
                    if (DateTime.TryParse(filter.CreatedDate, out DateTime DateValue))
                    {
                        querys = querys.Where(w => w.DateCreated.Date == DateValue.Date);
                    }
                }
                if (filter.Totalcost != null)
                {
                    querys = querys.Where(item => item.TotalAmount == filter.Totalcost);
                }
                if (!string.IsNullOrEmpty(filter.Status))
                {
                    querys = querys.Where(w => w.Status == filter.Status);
                }

                var data = await querys
           .Select(p => new PurchaseOrderListDto
           {
               Id = p.Id,
               Title = p.Title,
               OrderNumber = p.OrderNumber,
               Items = _context.PurchaseOrderItems
                   .Where(i => i.PurchaseOrderId == p.Id)
                   .Count(), // Count the number of items
               Quantity = _context.PurchaseOrderItems
                   .Where(i => i.PurchaseOrderId == p.Id)
                   .Sum(i => i.Quantity), // Sum the quantity
               TotalAmount = p.TotalAmount,
               Vendorname = _context.Vendors
                   .Where(v => v.Id == p.VendorId)
                   .Select(v => v.Name)
                   .FirstOrDefault(), // Get the vendor name
               DateCreated = p.DateCreated,
               Status = p.Status
           })
           .ToListAsync();

                return data as List<T>;
            }
            else if (typeof(T) == typeof(Payment))
            {
                var querys = from payment in _context.Payments
                            join user in _context.Users on payment.Email equals user.Email
                            select new { payment, user.HadAdminId };

                // Filter by admin ID.
                if (filter.Id != null)  // Assuming Id is nullable in FilterDto
                {
                    querys = querys.Where(q => q.HadAdminId == filter.Id);
                }

                if (!string.IsNullOrEmpty(filter.PaymentId))
                {
                    querys = querys.Where(q => q.payment.PaymentId.Contains(filter.PaymentId));
                }
                if (!string.IsNullOrEmpty(filter.Amount)) // Assuming Id is nullable in FilterDto
                {
                    querys = querys.Where(q => q.payment.Amount == filter.Amount);
                }
                if (!string.IsNullOrEmpty(filter.StartDate))
                {
                    // Try parsing full date
                    if (DateTime.TryParse(filter.StartDate, out DateTime DateValue))
                    {
                        querys = querys.Where(q => q.payment.Datetime.Date == DateValue.Date);
                    }
                }
                if (!string.IsNullOrEmpty(filter.Email))
                {
                    querys = querys.Where(q => q.payment.Email == filter.Email);
                }
                if (filter.RequestId != null)  // Assuming RequestId is nullable in FilterDto
                {
                    querys = querys.Where(q => q.payment.RequestId == filter.RequestId);
                }
                if (filter.WorkorderId != null)  // Assuming WorkorderId is nullable in FilterDto
                {
                    querys = querys.Where(q => q.payment.WorkorderId == filter.WorkorderId);
                }
                if (!string.IsNullOrEmpty(filter.Status))
                {
                    querys = querys.Where(q => q.payment.Status == filter.Status);
                }
                var result = querys.Select(q => q.payment);
                return await result.ToListAsync() as List<T>;
            }
            else if (typeof(T) == typeof(UserDto))
            {
                var querys = from user in _context.Users
                            join role in _context.Roles on user.RoleID equals role.RoleID
                            where user.HadAdminId == filter.Id
                            select new UserDto
                            {
                                UserID = user.UserID,
                                Username = user.Username,
                                Email = user.Email,
                                RoleName = role.RoleName,
                                RoleID = user.RoleID,
                                Password = user.Password,
                            };

                if (!string.IsNullOrEmpty(filter.Username))
                {
                    querys = querys.Where(w => w.Username.Contains(filter.Username));
                }
                if (!string.IsNullOrEmpty(filter.Email))
                {
                    querys = querys.Where(w => w.Email == filter.Email);
                }
                if (!string.IsNullOrEmpty(filter.Role))
                {
                    querys = querys.Where(w => w.RoleName == filter.Role);
                }

                return await querys.ToListAsync() as List<T>;
            }

            // Execute the query and return the results
            return await query.ToListAsync();
        }

    }

}

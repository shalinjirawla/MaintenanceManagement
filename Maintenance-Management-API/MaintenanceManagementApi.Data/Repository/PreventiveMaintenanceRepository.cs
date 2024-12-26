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

namespace MaintenanceManagementApi.Data.Repository
{
    public class PreventiveMaintenanceRepository : IPreventiveMaintenanceRepository
    {
        private readonly AppDbContext _context;

        public PreventiveMaintenanceRepository(AppDbContext context)
        {
            _context = context;
        }

        // Add new Preventive Maintenance
        public async Task<int> Insert(PreventiveMaintenance pm)
        {
            if (pm != null)
            {
                if (pm.Id == 0)
                {
                    await _context.PreventiveMaintenances.AddAsync(pm);
                    await _context.SaveChangesAsync();
                    return pm.Id;
                }
                else
                {
                    var existingPm = await _context.PreventiveMaintenances.FindAsync(pm.Id);
                    if (existingPm != null)
                    {
                        // Update other properties
                        _context.Entry(existingPm).CurrentValues.SetValues(pm);

                        // Save changes
                        await _context.SaveChangesAsync();  // Use async for better performance
                    }
                    return pm.Id;
                }
            }
            return 0;
        }

        //Add Schedule
        public async Task<int> InsertSchedule(PMSchedule pmSchedule)
        {
            if (pmSchedule != null)
            {
                if (pmSchedule.Id == 0)
                {
                    var existingschedule =  _context.PMSchedules.FirstOrDefault(s => s.PMId == pmSchedule.PMId);
                    if (existingschedule == null)
                    {
                        await _context.PMSchedules.AddAsync(pmSchedule);
                        await _context.SaveChangesAsync();
                        return pmSchedule.Id;
                    }


                    else
                    {
                        var existingdata = await _context.PMSchedules.FindAsync(pmSchedule.Id);
                        if (existingdata != null)
                        {
                            // Update other properties
                            _context.Entry(existingdata).CurrentValues.SetValues(pmSchedule);

                            // Save changes
                            await _context.SaveChangesAsync();  // Use async for better performance
                        }
                        return pmSchedule.Id;
                    }
                }
            }
            return 0;
        }

        //Get All Preventive Maintenace
        public async Task<List<PreventiveMaintenanceDto>> GetAll()
        {
            var result = await (from pm in _context.PreventiveMaintenances
                                join asset in _context.Assets on pm.Asset equals asset.Id
                                join user in _context.Users on pm.AssignTo equals user.UserID
                                join schedule in _context.PMSchedules on pm.Id equals schedule.PMId
                                select new PreventiveMaintenanceDto
                                {
                                    Id = pm.Id,
                                    Title = pm.Title,
                                    Asset = pm.Asset,
                                    AssetName = asset.AssetName,
                                    Location = pm.Location,
                                    AssignTo = pm.AssignTo,
                                    AssignToName = user.Username,
                                    Priority = pm.Priority,
                                    Category = pm.Category,
                                    StartDate = pm.StartDate,
                                    DueDate = pm.DueDate,
                                    CreatedBy = pm.CreatedBy,
                                    Description = pm.Description,
                                    ScheduleType = schedule.ScheduleType,
                                    FrequencyInterval = schedule.FrequencyInterval,
                                    FrequencyType = schedule.FrequencyType,
                                    DaysOfWeek = schedule.DaysOfWeek,
                                    WorkOrderDue = schedule.WorkOrderDue,
                                    AdvanceCreationPeriod = schedule.AdvanceCreationPeriod,
                                }).ToListAsync();

            return result;
        }

        //Get Preventive Maintenace By Admin
        public async Task<List<PreventiveMaintenanceDto>> GetAllPMById(int id)
        {
            //    return await _context.PreventiveMaintenances.Where(p=>p.CreatedBy == id).ToListAsync();

            var result = await (from pm in _context.PreventiveMaintenances
                                join asset in _context.Assets on pm.Asset equals asset.Id
                                join user in _context.Users on pm.AssignTo equals user.UserID
                                join location in _context.Locations on pm.Location equals location.Id
                                join schedule in _context.PMSchedules on pm.Id equals schedule.PMId
                                where pm.CreatedBy == id
                                select new PreventiveMaintenanceDto
                                {
                                    Id = pm.Id,
                                    Title = pm.Title,
                                    Asset = pm.Asset,
                                    AssetName = asset.AssetName,
                                    Location = pm.Location,
                                    Locationname=location.Name,
                                    AssignTo = pm.AssignTo,
                                    AssignToName = user.Username,
                                    Priority = pm.Priority,
                                    Category = pm.Category,
                                    StartDate = pm.StartDate,
                                    DueDate = pm.DueDate,
                                    CreatedBy = pm.CreatedBy,
                                    Description = pm.Description,
                                    ScheduleType = schedule.ScheduleType,
                                    FrequencyInterval = schedule.FrequencyInterval,
                                    FrequencyType = schedule.FrequencyType,
                                    DaysOfWeek = schedule.DaysOfWeek,
                                    WorkOrderDue = schedule.WorkOrderDue,
                                    AdvanceCreationPeriod = schedule.AdvanceCreationPeriod,
                                }).ToListAsync();

            return result;
        }

        //Get data for schedule counting
        public async Task<List<PreventiveMaintenanceDto>> GetSchedulesDueForWorkOrder()
        {
            return await (from pm in _context.PreventiveMaintenances
                          join schedule in _context.PMSchedules on pm.Id equals schedule.PMId
                          //join wocomplaint in _context.CompletedWorkOrders on schedule.WOId equals wocomplaint.WorkOrderId
                          select new PreventiveMaintenanceDto
                          {
                              Id = pm.Id,
                              Title = pm.Title,
                              Asset = pm.Asset,
                              AssignTo = pm.AssignTo,
                              StartDate = pm.StartDate,
                              DueDate = pm.DueDate,
                              ScheduleType = schedule.ScheduleType,
                              FrequencyInterval = schedule.FrequencyInterval,
                              FrequencyType = schedule.FrequencyType,
                              DaysOfWeek = schedule.DaysOfWeek,
                              WorkOrderDue = schedule.WorkOrderDue,
                              AdvanceCreationPeriod = schedule.AdvanceCreationPeriod,
                              LastGeneratedDate = schedule.LastGeneratedDate,
                              NextDueDate = schedule.NextDueDate,
                              Description = pm.Description,
                              Priority = pm.Priority,
                              Category = pm.Category,
                              Location = pm.Location,
                              CreatedBy = pm.CreatedBy,
                              WoId = schedule.WOId,
                              //  ComplationDate = wocomplaint.CompletionDate,
                          }).ToListAsync();
        }

        //Get Complation Date
        public DateTime? GetCompletionDate(int? woId)
        {
            if (woId == null)
            {
                return null;
            }
            var data = _context.CompletedWorkOrders
                           .Where(c => c.WorkOrderId == woId && c.Status == "Complete")
                           .Select(c => c.CompletionDate)
                           .FirstOrDefault(); // This will return null if no records match

            return data;
        }
        //auto insert work order
        public async Task<int> InsertWorkOrder(WorkOrder workOrder)
        {
            _context.WorkOrders.Add(workOrder);
            await _context.SaveChangesAsync();
            return workOrder.Id;
        }

        //Last generated date updated
        public async Task<int> UpdateLastGeneratedDate(int id, DateTime lastgenerateddate, int woid, DateTime duedate)
        {
            // Find the record by the id
            var preventiveMaintenance = await _context.PMSchedules
                .FirstOrDefaultAsync(pm => pm.PMId == id);

            // If the record exists, update the LastGeneratedDate
            if (preventiveMaintenance != null)
            {
                preventiveMaintenance.LastGeneratedDate = lastgenerateddate;
                preventiveMaintenance.WOId = woid;
                preventiveMaintenance.NextDueDate = duedate;

                // Save changes to the database
                return await _context.SaveChangesAsync();
            }

            // If the record is not found, return 0 or handle it accordingly
            return 0;
        }

        // Delete Preventive Maintenance
        public async Task<bool> Delete(List<int> id)
        {// Fetch all related PM Schedules for the provided IDs
            var pmScheduleEntities = await _context.PMSchedules.Where(p => id.Contains(p.PMId)).ToListAsync();

            if (pmScheduleEntities.Any())
            {
                _context.PMSchedules.RemoveRange(pmScheduleEntities); // Remove related PM schedules
            }
            // Fetch all PM entities to delete
            var pmEntities = await _context.PreventiveMaintenances.Where(pm => id.Contains(pm.Id)).ToListAsync();

            if (!pmEntities.Any())
            {
                return false; // No records found to delete
            }

            _context.PreventiveMaintenances.RemoveRange(pmEntities); // Remove PM entities
            await _context.SaveChangesAsync(); // Commit changes
            return true;
        }

        //Advance Filter PM 
        public async Task<IEnumerable<PreventiveMaintenanceDto>> GetFilteredPM(FilterDto filter)
        {
            var query = from pm in _context.PreventiveMaintenances
                        join asset in _context.Assets on pm.Asset equals asset.Id
                        join user in _context.Users on pm.AssignTo equals user.UserID
                        join schedule in _context.PMSchedules on pm.Id equals schedule.PMId
                        where true // Ensure the query doesn't filter out all results unintentionally
                        select new PreventiveMaintenanceDto
                        {
                            Id = pm.Id,
                            Title = pm.Title,
                            Asset = pm.Asset,
                            AssetName = asset.AssetName,
                            Location = pm.Location,
                            AssignTo = pm.AssignTo,
                            AssignToName = user.Username,
                            Priority = pm.Priority,
                            Category = pm.Category,
                            StartDate = pm.StartDate,
                            DueDate = pm.DueDate,
                            CreatedBy = pm.CreatedBy,
                            Description = pm.Description,
                            ScheduleType = schedule.ScheduleType,
                            FrequencyInterval = schedule.FrequencyInterval,
                            FrequencyType = schedule.FrequencyType,
                            DaysOfWeek = schedule.DaysOfWeek,
                            WorkOrderDue = schedule.WorkOrderDue,
                            AdvanceCreationPeriod = schedule.AdvanceCreationPeriod,
                        };

            // Apply filters based on the input
            if (filter.Id.HasValue)
            {
                query = query.Where(w => w.CreatedBy == filter.Id.Value);
            }
            if (!string.IsNullOrEmpty(filter.Name))
            {
                query = query.Where(w => w.Title.Contains(filter.Name));
            }
            if (!string.IsNullOrEmpty(filter.ScheduleType))
            {
                query = query.Where(w => w.ScheduleType.Contains(filter.ScheduleType));
            }
            if (!string.IsNullOrEmpty(filter.AssetName))
            {
                var asset = await _context.Assets
                    .FirstOrDefaultAsync(a => a.AssetName == filter.AssetName);

                if (asset != null)
                {
                    query = query.Where(w => w.Asset == asset.Id);
                }
            }
            if (!string.IsNullOrEmpty(filter.AssignedTo))
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == filter.AssignedTo);

                if (user != null)
                {
                    query = query.Where(w => w.AssignTo == user.UserID);
                }
            }
            if (!string.IsNullOrEmpty(filter.Priority))
            {
                query = query.Where(w => w.Priority == filter.Priority);
            }
            if (!string.IsNullOrEmpty(filter.Category))
            {
                query = query.Where(w => w.Category == filter.Category);
            }

            return await query.ToListAsync();
        }


    }
}

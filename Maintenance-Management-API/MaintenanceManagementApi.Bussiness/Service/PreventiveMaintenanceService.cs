﻿using AutoMapper;
using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Data.IRepository;
using MaintenanceManagementApi.Data.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace MaintenanceManagementApi.Bussiness.Service
{
    public class PreventiveMaintenanceService : IPreventiveMaintenanceService
    {
        private readonly IPreventiveMaintenanceRepository _preventiveMaintenanceRepository;
        private readonly IMapper _mapper;

        public PreventiveMaintenanceService(IPreventiveMaintenanceRepository preventiveMaintenanceRepository, IMapper mapper)
        {
            _preventiveMaintenanceRepository = preventiveMaintenanceRepository;
            _mapper = mapper;
        }

        // Add new Preventive Maintenance
        public async Task<int> Insert(PreventiveMaintenanceDto pmdto)
        {
            var pmdata = _mapper.Map<PreventiveMaintenance>(pmdto);
            await _preventiveMaintenanceRepository.Insert(pmdata);

            if (pmdata.Id != 0)
            {
                var scheduledata = _mapper.Map<PMSchedule>(pmdto);
                scheduledata.Id = 0;
                scheduledata.PMId = pmdata.Id;
                await _preventiveMaintenanceRepository.InsertSchedule(scheduledata);
            }
            return pmdata.Id;
        }

        //Get All Preventive Maintenace
        public async Task<List<PreventiveMaintenanceDto>> GetAll()
        {
            return await _preventiveMaintenanceRepository.GetAll();
        }

        //Get Preventive Maintenace By Admin
        public async Task<List<PreventiveMaintenanceDto>> GetAllPMById(int id)
        {
            return await _preventiveMaintenanceRepository.GetAllPMById(id);
        }

 

        //Auto generated work order funcation
        public async Task<int> GenerateWorkOrdersAsync()
        {
            // 1. Fetch preventive maintenance records and schedules due for work order creation
            var preventiveSchedules = await _preventiveMaintenanceRepository.GetSchedulesDueForWorkOrder();

            int generatedWorkOrdersCount = 0;

            foreach (var pm in preventiveSchedules)
            {
                // how long pm run for particular asset
                if (DateTime.Today < pm.DueDate)
                {
                    // 2. Calculate startdate duedate generateddate based on schedule frequency
                    //   var (startdate, duedate, generatedDate) = CalculateWorkOrderSchedule(pm);
                    (DateTime startDate, DateTime duedate, DateTime generatedDate) = pm.ScheduleType == "Calendar - Regular Inter"
                    ? CalculateWorkOrderSchedule(pm)
                    : CalculateAfterCompletionSchedule(pm);
                    if (DateTime.Today >= generatedDate && DateTime.Today <= duedate)
                        {
                            // 3. Create a new work order for this schedule
                            var workOrder = new WorkOrder
                            {
                                Id = 0,
                                Title = pm.Title,
                                Description = pm.Description,
                                Status = "Open",
                                Priority = pm.Priority,
                                Category = pm.Category,
                                Location = pm.Location.ToString(),
                                Asset = pm.Asset.ToString(),
                                AssignedTo = pm.AssignTo ?? 0,
                                RequestedId = pm.CreatedBy ?? 0,
                                DueDate = duedate,
                                StartDate = startDate,
                                DateCreated = DateTime.Today,
                            };

                            var woid = await _preventiveMaintenanceRepository.InsertWorkOrder(workOrder);
                            generatedWorkOrdersCount++;

                            await _preventiveMaintenanceRepository.UpdateLastGeneratedDate(pm.Id ?? 0, generatedDate, woid, duedate);

                        }                   
                }
            }

            return generatedWorkOrdersCount;
        }

        //Generate Startdate, Duedate and Autogenerated date for regular schedule
        private (DateTime startDate, DateTime endDate, DateTime generateDate) CalculateWorkOrderSchedule(PreventiveMaintenanceDto pm)
        {
            // Step 1: Determine base date
            DateTime startDate = pm.NextDueDate ?? pm.StartDate ?? DateTime.Today;

            // Step 2: Calculate end date based on duration
            DateTime endDate = startDate;
            if (pm.FrequencyInterval == null || pm.FrequencyInterval <= 0)
                throw new ArgumentException("Frequency interval must be a positive integer.");

            switch (pm.FrequencyType.ToLower())
            {
                case "day(s)":
                    endDate = startDate.AddDays(pm.FrequencyInterval.Value - 1);
                    if (pm.FrequencyInterval == 1)
                    {
                        startDate = DateTime.Today; // Update to today's date
                        endDate = startDate; // Single day duration
                    }
                    break;
                case "week(s)":
                    int totalDays = 7 * pm.FrequencyInterval.Value;
                    endDate = startDate.AddDays(totalDays - 1);

                    if (!string.IsNullOrEmpty(pm.DaysOfWeek))
                    {
                        var dayMapping = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
                            {
                            { "Su", "Sunday" },
                            { "Mo", "Monday" },
                            { "Tu", "Tuesday" },
                            { "We", "Wednesday" },
                            { "Th", "Thursday" },
                            { "Fr", "Friday" },
                            { "Sa", "Saturday" }
                    };
                        var targetDays = pm.DaysOfWeek.Split(',')
                                                .Select(day => dayMapping.ContainsKey(day.Trim())
                                         ? Enum.Parse<DayOfWeek>(dayMapping[day.Trim()], true)
                                         : throw new ArgumentException($"Invalid day abbreviation: {day.Trim()}"))
                           .ToList();

                        DateTime lastOccurrence = startDate;
                        int occurrenceCount = 0;

                        // Loop through each day within the 2-week period
                        for (int i = 0; i < totalDays; i++)
                        {
                            DateTime currentDay = startDate.AddDays(i);

                            // Check if the current day is one of the target days (e.g., Monday or Tuesday)
                            if (targetDays.Contains(currentDay.DayOfWeek))
                            {
                                lastOccurrence = currentDay;
                                occurrenceCount++;
                            }
                        }

                        // Set the end date to the last occurrence of the target day within the period
                        endDate = lastOccurrence;
                    }

                    break;
                case "month(s)":
                    endDate = startDate.AddMonths(pm.FrequencyInterval.Value);
                    break;
                case "year(s)":
                    endDate = startDate.AddYears(pm.FrequencyInterval.Value);
                    break;
                default:
                    throw new ArgumentException("Unsupported duration type.");

            }

            // Step 3: Calculate the advance generation date based on `advanceValue` and `advanceType`
            DateTime generateDate = GeneratedDate(startDate, pm.WorkOrderDue, pm.AdvanceCreationPeriod);

            return (startDate, endDate, generateDate);
        }

        private DateTime GeneratedDate(DateTime startDate, int? WorkOrderDue, string AdvanceCreationPeriod)
        {
            DateTime generateDate = startDate;
            if (!string.IsNullOrEmpty(AdvanceCreationPeriod))
            {
                // Check if AdvanceCreationPeriod is in terms of "day(s)", "month(s)", or "year(s)"
                if (AdvanceCreationPeriod.Contains("Day(s)") || AdvanceCreationPeriod.Contains("Month(s)") || AdvanceCreationPeriod.Contains("Week(s)") || AdvanceCreationPeriod.Contains("Year(s)"))
                {
                    switch (AdvanceCreationPeriod.ToLower())
                    {
                        case "day(s)":
                            generateDate = startDate.AddDays(-WorkOrderDue.Value);
                            break;
                        case "week(s)":
                            generateDate = startDate.AddDays(-7 * WorkOrderDue.Value);
                            break;
                        case "month(s)":
                            generateDate = startDate.AddMonths(-WorkOrderDue.Value);
                            break;

                        default:
                            throw new ArgumentException("Unsupported advance type.");
                    }
                }
                else
                {
                    // Split the DaysOfWeek string into a list of day abbreviations (e.g., "Mon, Tue")
                    var targetDay = AdvanceCreationPeriod.Trim().ToLower();

                    // Loop over the target days and find the latest match from startDate

                    // Parse the target day (e.g., Mon, Tue) into a DayOfWeek enum
                    DayOfWeek targetEnumDay = targetDay switch
                    {
                        "mon" => DayOfWeek.Monday,
                        "tue" => DayOfWeek.Tuesday,
                        "wed" => DayOfWeek.Wednesday,
                        "thu" => DayOfWeek.Thursday,
                        "fri" => DayOfWeek.Friday,
                        "sat" => DayOfWeek.Saturday,
                        "sun" => DayOfWeek.Sunday,
                        _ => throw new ArgumentException("Invalid day abbreviation.")
                    };

                    // Calculate the difference in days between the current startDate and the targetEnumDay
                    int daysToSubtract = (7 + ((int)startDate.DayOfWeek - (int)targetEnumDay)) % 7;

                    // If it's the same day, subtract 7 days to get the previous instance of the target day
                    if (daysToSubtract == 0)
                    {
                        daysToSubtract = 7;
                    }
                    // Subtract the calculated number of days from the startDate
                    generateDate = startDate.AddDays(-daysToSubtract);
                }
            }

            return generateDate;
        }

        private (DateTime startDate, DateTime endDate, DateTime generatedDate) CalculateAfterCompletionSchedule(PreventiveMaintenanceDto pm)
        {
            
            DateTime? completionDate = _preventiveMaintenanceRepository.GetCompletionDate(pm.WoId);            
            if (completionDate == null || completionDate == DateTime.MinValue)
            {
                //throw new InvalidOperationException("Completion date not found for the given Work Order ID.");
                return (DateTime.MaxValue, DateTime.MaxValue, DateTime.MaxValue);
            }
            DateTime generateDate = GeneratedDate(completionDate.Value, pm.WorkOrderDue, pm.AdvanceCreationPeriod);
            DateTime endDate = completionDate.Value;

            return (completionDate.Value, endDate, generateDate);
        }

        // Delete Preventive Maintenance
        public async Task<bool> Delete(List<int> id)
        {           
            return await _preventiveMaintenanceRepository.Delete(id);
        }

        //Advance Filter PM 
        public async Task<IEnumerable<PreventiveMaintenanceDto>> GetFilteredPM(FilterDto filter)
        {
            var data = await _preventiveMaintenanceRepository.GetFilteredPM(filter);
           
            return data;
        }

    }
}

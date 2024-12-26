using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.IRepository
{
    public interface IPreventiveMaintenanceRepository
    {
        // Add new Preventive Maintenance
        Task<int> Insert(PreventiveMaintenance pm);

        //Add Schedule
        Task<int> InsertSchedule(PMSchedule pmSchedule);

        //Get All Preventive Maintenace
        Task<List<PreventiveMaintenanceDto>> GetAll();

        //Get Preventive Maintenace By Admin
        Task<List<PreventiveMaintenanceDto>> GetAllPMById(int id);

        //Get data for schedule counting
        Task<List<PreventiveMaintenanceDto>> GetSchedulesDueForWorkOrder();

        //auto insert work order
        Task<int> InsertWorkOrder(WorkOrder workOrder);

        //Last generated date updated
        Task<int> UpdateLastGeneratedDate(int id, DateTime lastgenerateddate,int woid,DateTime duedate);

        // Delete Preventive Maintenance
        Task<bool> Delete(List<int> id);

        DateTime? GetCompletionDate(int? woId);

        //Advance Filter PM 
        Task<IEnumerable<PreventiveMaintenanceDto>> GetFilteredPM(FilterDto filter);
    }
}

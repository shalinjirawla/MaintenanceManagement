using MaintenanceManagementApi.Common.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.IService
{
    public interface IPreventiveMaintenanceService
    {
        // Add new Preventive Maintenance
        Task<int> Insert(PreventiveMaintenanceDto pmdto);

        //Get All Preventive Maintenace
        Task<List<PreventiveMaintenanceDto>> GetAll();

        //Get Preventive Maintenace By Admin
        Task<List<PreventiveMaintenanceDto>> GetAllPMById(int id);

        //Auto generated work order funcation
        Task<int> GenerateWorkOrdersAsync();

        // Delete Preventive Maintenance
        Task<bool> Delete(List<int> id);

    }
}

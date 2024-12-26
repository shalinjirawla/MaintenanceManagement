using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.IRepository
{
    public interface ILocationRepository
    {
        // Add new Location
        Task<int> Insert(Location location);

        //Get All Location by hadAdmin
        Task<List<Location>> GetAll();

        //Get By Admin id location
        Task<List<Location>> GetById(int id);

        // Delete Location
        Task<bool> Delete(List<int> id);

        //Advance Filter location
        Task<List<Location>> GetFilteredlocation(FilterDto filter);
    }
}

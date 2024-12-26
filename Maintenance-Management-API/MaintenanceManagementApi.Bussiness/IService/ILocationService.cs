using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.IService
{
    public interface ILocationService
    {
        // Add new Location
        Task<int> Insert(LocationDto LocationDto);

        //Get All Location by hadAdmin
        Task<List<LocationDto>> GetAll();

        //Get By Admin id location
        Task<List<LocationDto>> GetById(int id);

        // Delete Location
        Task<bool> Delete(List<int> id);

        //Advance Filter location
        Task<List<LocationDto>> GetFilteredlocation(FilterDto filter);
    }
}

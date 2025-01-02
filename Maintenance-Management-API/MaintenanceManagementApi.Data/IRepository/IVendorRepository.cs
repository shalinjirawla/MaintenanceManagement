using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.IRepository
{
    public interface IVendorRepository
    {
        // Register New Vendor
        Task<int> Insert(Vendor vendor);

        // Get Vendor by Admin
        Task<List<Vendor>> GetVendor(int id);

        //Delete Vendor
        Task<bool> DeleteVendor(List<int> ids);
        
    }
}

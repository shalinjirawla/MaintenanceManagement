using MaintenanceManagementApi.Common.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.IService
{
    public interface IVendorService
    {
        // Register New Vendor
        Task<int> Insert(VendorDto vendorDto);

        // Get Vendor by Admin
        Task<List<VendorDto>> GetVendor(int id);

        //Delete Vendor
        Task<bool> DeleteVendor(List<int> ids);

        //Advance Filter Vendore
        Task<List<VendorDto>> GetVendore(FilterDto filter);
    }
}

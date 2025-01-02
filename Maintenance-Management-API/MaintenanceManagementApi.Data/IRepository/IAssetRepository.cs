using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.IRepository
{
    public interface IAssetRepository
    {
        // Add new asset
        Task<int> Insert(Asset asset);

        //Get By Admin id assets
       Task<List<Asset>> GetById(int id);

        //Delete Assets
        Task<int> DeleteAssets(List<int> id);

    }
}

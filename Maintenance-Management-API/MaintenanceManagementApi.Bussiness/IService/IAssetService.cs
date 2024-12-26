using MaintenanceManagementApi.Common.ViewModel;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.IService
{
    public interface IAssetService
    {
        //Image upload
        Task<string> Upload(IFormFile file);

        // Add new asset
        Task<int> Insert(AssetDto assetDto);

        //Get By Admin id assets
        Task<List<AssetDto>> GetById(int id);

        //Delete Assets
        Task<int> DeleteAssets(List<int> id);

        //Advance Filter Assets 
        Task<IEnumerable<AssetDto>> GetFilteredassets(FilterDto filter);
    }
}

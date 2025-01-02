using AutoMapper;
using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Data.IRepository;
using MaintenanceManagementApi.Data.Repository;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.Service
{
    public class AssetService:IAssetService
    {
        private readonly IAssetRepository _assetRepository;
        private readonly IMapper _mapper;
        private readonly string _uploadFolder;

        public AssetService(IAssetRepository assetRepository,IMapper mapper)
        {
            _assetRepository = assetRepository;
            _mapper = mapper;
            _uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/Uploads");
        }
        //Image upload
        public async Task<string> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("No file uploaded.");
            }
            var fileName = Path.GetFileName(file.FileName);
            var filePath = Path.Combine(_uploadFolder, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return fileName;

        }

        // Add new asset
        public async Task<int> Insert(AssetDto assetDto)
        {
            var data = _mapper.Map<Asset>(assetDto);
            await _assetRepository.Insert(data);
            return data.Id;
        }


        //Get By Admin id assets
        public async Task<List<AssetDto>> GetById(int id)
        {
            var data = await _assetRepository.GetById(id);
            string baseUrl = "https://localhost:7025/wwwroot/Uploads/";
            var requestdata = _mapper.Map<List<AssetDto>>(data);

            foreach (var message in requestdata)
            {
                if (!string.IsNullOrEmpty(message.AssetImage))
                {
                    var imageNames = message.AssetImage.Split(',');
                    message.AssetImage = string.Join(",", imageNames.Select(name => $"{baseUrl}{name}"));
                }
            }
            return requestdata;
        }

        //Delete Assets
        public async Task<int> DeleteAssets(List<int> id)
        {
            var result = await _assetRepository.DeleteAssets(id);
            return result;
        }

    }
}

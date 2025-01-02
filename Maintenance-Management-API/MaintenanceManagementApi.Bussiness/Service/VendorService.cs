using AutoMapper;
using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Data.IRepository;
using MaintenanceManagementApi.Data.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.Service
{
    public class VendorService:IVendorService
    {
        private readonly IVendorRepository _vendorRepository;
        private readonly IMapper _mapper;

        public VendorService(IVendorRepository vendorRepository, IMapper mapper)
        {
            _vendorRepository = vendorRepository;
            _mapper = mapper;
        }

        // Register New Vendor
        public async Task<int> Insert(VendorDto vendorDto)
        {
            var data = _mapper.Map<Vendor>(vendorDto);
            return await _vendorRepository.Insert(data);
        }

        // Get Vendor by Admin
        public async Task<List<VendorDto>> GetVendor(int id)
        {
            var data = await _vendorRepository.GetVendor(id);
            return _mapper.Map<List<VendorDto>>(data);
        }

        //Delete Vendor
        public async Task<bool> DeleteVendor(List<int> ids)
        {
            var result = await _vendorRepository.DeleteVendor(ids);
            return result;
        }

    }
}

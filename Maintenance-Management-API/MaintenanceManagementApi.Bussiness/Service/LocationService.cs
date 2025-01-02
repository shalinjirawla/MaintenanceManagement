using AutoMapper;
using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Data.IRepository;
using MaintenanceManagementApi.Data.Repository;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.Service
{
    public class LocationService:ILocationService
    {
        private readonly ILocationRepository _locationRepository;
        private readonly IMapper _mapper;

        public LocationService(ILocationRepository locationRepository, IMapper mapper)
        {
            _locationRepository = locationRepository;
            _mapper = mapper;
        }
        // Add new Location
        public async Task<int> Insert(LocationDto LocationDto)
        {
            var data = _mapper.Map<Location>(LocationDto);
            await _locationRepository.Insert(data);
            return data.Id;
        }

        //Get All Location by hadAdmin
        public async Task<List<LocationDto>> GetAll()
        {
            var data = await _locationRepository.GetAll();
            var requestdata = _mapper.Map<List<LocationDto>>(data);
            return requestdata;
        }


        //Get By Admin id location
        public async Task<List<LocationDto>> GetById(int id)
        {
            var data = await _locationRepository.GetById(id);           
            var requestdata = _mapper.Map<List<LocationDto>>(data);
            return requestdata;
        }

        // Delete Location
        public async Task<bool> Delete(List<int> id)
        {
            return await _locationRepository.Delete(id);
        }

    }
}

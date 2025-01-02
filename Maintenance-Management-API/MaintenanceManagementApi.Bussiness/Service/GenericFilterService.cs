using AutoMapper;
using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.IRepository;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.Service
{
    public class GenericFilterService <T, TDto> : IGenericFilterService<TDto>
        where T : class
        where TDto : class
    {
        private readonly IGenericRepository<T> _genericRepository;
        private readonly IMapper _mapper;

        public GenericFilterService(IGenericRepository<T> genericRepository, IMapper mapper)
        {
            _genericRepository = genericRepository;
            _mapper = mapper;
        }
        public async Task<List<TDto>> GetFilteredData(FilterDto filter)
        {
            // Pass filter directly to the repository, which handles filtering logic
            var entities = await _genericRepository.GetFilteredDataAsync(filter);

            // Map the entities to DTOs to return to the controller
            return _mapper.Map<List<TDto>>(entities);
        }


    }
}

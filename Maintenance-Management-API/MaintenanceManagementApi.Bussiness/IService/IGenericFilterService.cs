using MaintenanceManagementApi.Common.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.IService
{
    public interface IGenericFilterService<TDto> where TDto : class
    {
        Task<List<TDto>> GetFilteredData(FilterDto filter);
    }
}

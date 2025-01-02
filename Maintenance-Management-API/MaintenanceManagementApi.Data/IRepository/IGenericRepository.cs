using MaintenanceManagementApi.Common.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.IRepository
{
    public interface IGenericRepository<T> where T : class
    {
        Task<List<T>> GetFilteredDataAsync(FilterDto filter);
    }

}

using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.IService
{
    public interface IAuthService
    {

        //Authenticate user
        Task<string> Authenticate(string username, string password, string Adminname);

        // Get All Admins
        Task<List<UserDto>> GetAlladmin();

    }
}

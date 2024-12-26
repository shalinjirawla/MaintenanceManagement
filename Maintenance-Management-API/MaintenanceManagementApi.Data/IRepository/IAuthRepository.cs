using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.IRepository
{
    public interface IAuthRepository
    {
        //Authenticate user
        Task<User> GetUserByUsername(string username,string Adminname);

        //Get Rights
        Task<(string RoleName, List<string> Rights)> GetRightsByRoleId(int roleId);

        // Get All Admins
        Task<List<User>> GetAlladmin();

    }
}

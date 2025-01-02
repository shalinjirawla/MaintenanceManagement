using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.IRepository
{
    public interface IUserRepository
    {
        // Register New User
        Task<int> Insert(User user);

        //Get All emplyee with all details
        Task<List<UserDto>> GetAllEmployeeall(int id);

        // Get available employees
        Task<List<User>> GetAvailableEmployees(DateTime startDate, DateTime endDate, int hadid);

        // Get Role By Id
        Task<List<Role>> GetRoleById(string role);

        //Delete User
        Task<bool> DeleteUsers(List<int> ids);

        
        // Get All emplyee count by admin
        Task<int> GetAllEmployeeallcount(int id);

        //Check Exist User
        Task<bool> CheckExist(string username, int id, int uid);

    }
}

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
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }
        // Register New User
        public async Task<int> Insert(RegisterUserDto registerDto)
        {
            var data = _mapper.Map<User>(registerDto);
            if (registerDto.UserID == 0)
            {
                data.Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);
            }
            else
            {
                data.Password = null;
            }
            await _userRepository.Insert(data);
            return data.UserID;
        }

        //Get All emplyee with all details
        public async Task<List<UserDto>> GetAllEmployeeall(int id)
        {
            var result = await _userRepository.GetAllEmployeeall(id);
            return result;
        }

        // Get available employees
        public async Task<List<UserDto>> GetAvailableEmployees(DateTime startDate, DateTime endDate, int hadid)
        {
            var result = await _userRepository.GetAvailableEmployees(startDate, endDate, hadid);
            return _mapper.Map<List<UserDto>>(result);
        }

        // Get Role By Id
        public async Task<List<RoleDto>> GetRoleById(string role)
        {
            var result = await _userRepository.GetRoleById(role);
            return _mapper.Map<List<RoleDto>>(result);
        }

        //Delete User
        public async Task<bool> DeleteUsers(List<int> ids)
        {

            var result = await _userRepository.DeleteUsers(ids);
            return result;
        }

        //Advance Filter User 
        public async Task<IEnumerable<UserDto>> GetFilteredUsers(FilterDto filter)
        {
            var data = await _userRepository.GetFilteredUsers(filter);
            var requestdata = _mapper.Map<IEnumerable<UserDto>>(data);
            return requestdata;
        }

        // Get All emplyee count by admin
        public async Task<int> GetAllEmployeeallcount(int id)
        {
            var result = await _userRepository.GetAllEmployeeallcount(id);
            return result;
        }


    }
}

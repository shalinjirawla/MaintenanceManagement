using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DataDbContext;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Data.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        // Register New User
        public async Task<int> Insert(User user)
        {

            if (user.UserID == 0)
            {
                bool userExists = await _context.Users
                .AnyAsync(u => u.Username == user.Username && u.HadAdminId == user.HadAdminId);

                if (userExists)
                {
                    return 0; // Indicates that the user already exists
                }

                await _context.Users.AddAsync(user);
                _context.SaveChanges();
                return user.UserID;
            }
            else
            {
                var existingUser = await _context.Users.FindAsync(user.UserID);
                if (existingUser != null)
                {
                    bool usernameTaken = await _context.Users
              .AnyAsync(u => u.Username == user.Username && u.HadAdminId == user.HadAdminId && u.UserID != user.UserID);


                    if (usernameTaken)
                    {
                        return 0; // Username is already taken by another user
                    }
                    existingUser.UpdatedAt = DateTime.Now;

                    // Update fields
                    existingUser.Username = user.Username;
                    existingUser.Email = user.Email;
                    existingUser.RoleID = user.RoleID;

                    // Update password only if a new one is provided
                    if (!string.IsNullOrWhiteSpace(user.Password))
                    {
                        existingUser.Password = user.Password;
                    }

                    _context.Users.Update(existingUser);
                    await _context.SaveChangesAsync();
                    return existingUser.UserID;
                }

                return 0; // User not found
            }
        }

        //Get Child Users of login admin
        public async Task<List<UserDto>> GetAllEmployeeall(int id)
        {
            var query = id == 1
        ? _context.Users
        : _context.Users.Where(user => user.HadAdminId == id);

            return await (from user in query
                          join role in _context.Roles on user.RoleID equals role.RoleID
                          select new UserDto
                          {
                              UserID = user.UserID,
                              Username = user.Username,
                              Email = user.Email,
                              RoleName = role.RoleName,
                              RoleID = user.RoleID,
                              Password = user.Password,
                          }).ToListAsync();

        }

        //Get awailable employees
        public async Task<List<User>> GetAvailableEmployees(DateTime startDate, DateTime endDate, int hadid)
        {
            //return availableEmployees;
            var availableEmployees = await (from u in _context.Users
                                            where u.RoleID == 4 && u.HadAdminId == hadid &&
                                                  !(from w in _context.WorkOrders
                                                    where w.Status != "Complete" &&
                                                          w.AssignedTo == u.UserID &&
                                                          // Updated overlap condition
                                                          ((w.StartDate < endDate && w.DueDate > startDate) ||
                                                           (w.StartDate < endDate && w.StartDate >= startDate) ||
                                                           (w.DueDate > startDate && w.DueDate <= endDate))
                                                    select w).Any()
                                            select u).ToListAsync();

            return availableEmployees;
        }

        // Get Role By Id
        public async Task<List<Role>> GetRoleById(string role)
        {
            switch (role)
            {
                case "Host Admin":
                    return await _context.Roles.ToListAsync();
                case "Admin":
                    return await _context.Roles.Where(role => role.RoleID == 3 || role.RoleID == 4).ToListAsync();
                // Add more cases as needed
                default:
                    return new List<Role>();
            }
        }

        //Delete User
        public async Task<bool> DeleteUsers(List<int> ids)
        {
            var users = await _context.Users.Where(u => ids.Contains(u.UserID)).ToListAsync();

            if (!users.Any())
            {
                return false;
            }

            _context.Users.RemoveRange(users);
            try
            {
                await _context.SaveChangesAsync();
                return true; // Return the count of successfully deleted users.
            }
            catch (DbUpdateException ex)
            {
                // Log the exception or handle it as per your application's logging framework.
                Console.WriteLine($"Error deleting users: {ex.Message}");

                // Return a specific value indicating the failure.
                return false; // Indicates a failure due to foreign key constraints.
            }
            //_context.SaveChanges();
            //return users.Count;
        }
     
        // Get All emplyee count by admin
        public async Task<int> GetAllEmployeeallcount(int id)
        {
            var query = id == 1 ? _context.Users : _context.Users.Where(user => user.HadAdminId == id);

            return await query.CountAsync();  // Count the number of users
        }

        //Check Exist User
        public async Task<bool> CheckExist(string username, int id, int uid)
        {
            if (uid == 0)
            {
                return await _context.Users.AnyAsync(u => u.Username == username && u.HadAdminId == id);
            }
            else
            {
                return await _context.Users.AnyAsync(u =>
                    u.Username == username &&
                    u.HadAdminId == id &&
                    u.UserID != uid
                );
            }
        }


    }
}

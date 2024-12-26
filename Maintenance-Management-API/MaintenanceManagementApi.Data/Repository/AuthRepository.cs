using MaintenanceManagementApi.Data.DataDbContext;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.Repository
{
    public class AuthRepository : IAuthRepository
    {
        private readonly AppDbContext _context;

        public AuthRepository(AppDbContext appDbContext)
        {
            _context = appDbContext;
        }


        //Authenticate user
        public async Task<User> GetUserByUsername(string username, string Adminname)
        {
            if (Adminname == null)
            {
                Adminname = "hostadmin";
                var hostadmin = await _context.Users.FirstOrDefaultAsync(x => x.Username == Adminname && x.RoleID == 1);
                if (hostadmin == null)
                {
                    return null;
                }
                var hostadmindata = await _context.Users.FirstOrDefaultAsync(u =>u.Username==hostadmin.Username && u.HadAdminId==hostadmin.UserID);
                return hostadmindata;
            }
            else
            {
                var admin = await _context.Users.FirstOrDefaultAsync(x => x.Username == Adminname && (x.RoleID == 2 || x.RoleID==1));
                if (admin == null)
                {
                    return null;
                }
                var data = await _context.Users.FirstOrDefaultAsync(u => u.Username == username && u.HadAdminId==admin.UserID);
                return data;
            }
        }

        //Get Rights
        public async Task<(string RoleName, List<string> Rights)> GetRightsByRoleId(int roleId)
        {
            var rights = await (from rr in _context.RoleRights
                                join r in _context.Rights on rr.RightsID equals r.RightsID
                                where rr.RoleID == roleId
                                select r.RightsName).ToListAsync();

            var role = await (from r in _context.Roles
                              where r.RoleID == roleId
                              select r.RoleName).FirstAsync();

            return (role, rights);
        }

        // Get All Admins
        public async Task<List<User>> GetAlladmin()
        {
            return await _context.Users
                      .Where(u => u.RoleID == 1 || u.RoleID == 2)
                      .ToListAsync();
        }


    }
}

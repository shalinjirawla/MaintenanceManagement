using AutoMapper;
using MaintenanceManagementApi.Bussiness.IService;
using MaintenanceManagementApi.Common.ViewModel;
using MaintenanceManagementApi.Data.DBModel;
using MaintenanceManagementApi.Data.IRepository;
using MaintenanceManagementApi.Data.Repository;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Bussiness.Service
{
    public class AuthService:IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;
        public AuthService(IAuthRepository authRepository, IMapper mapper, IConfiguration configuration) 
        {
            _authRepository = authRepository;
            _configuration = configuration;
            _mapper = mapper;
        }       

        //Login Authentication 
        public async Task<string> Authenticate(string username, string password,string Adminname)
        {
            var user = await _authRepository.GetUserByUsername(username, Adminname);

            if (user == null || !VerifyPassword(password, user.Password))
            {
                return null;
            }
            var roleRights = await _authRepository.GetRightsByRoleId(user.RoleID);
            var token = GenerateJwtToken(user,roleRights.RoleName,roleRights.Rights);

            return (token);
        }

        //Password Verification
        private bool VerifyPassword(string password, string storedPasswordHash)
        {
            return BCrypt.Net.BCrypt.Verify(password, storedPasswordHash);  // Example using BCrypt
        }

        //Generate Token
        private string GenerateJwtToken(User user,string role, List<string> rights)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserID.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("username", user.Username),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.FamilyName, user.HadAdminId.ToString())
            };
            // Add the user's rights as claims
            foreach (var right in rights)
            {
                claims.Add(new Claim("Rights", right));  // Custom claim for rights
            }
            claims.Add(new Claim("Role", role));


            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"], // Ensure this matches the configuration
                claims: claims,
                expires: DateTime.Now.AddMinutes(120),   
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        // Get All Admins
        public async Task<List<UserDto>> GetAlladmin()
        {
            var data = await _authRepository.GetAlladmin();
            return _mapper.Map<List<UserDto>>(data);
        }

    }
}

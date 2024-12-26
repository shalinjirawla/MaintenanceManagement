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
    public class VendorRepository : IVendorRepository
    {
        private readonly AppDbContext _context;

        public VendorRepository(AppDbContext context)
        {
            _context = context;
        }

        // Register New Vendor
        public async Task<int> Insert(Vendor vendor)
        {
            if (vendor == null)
            {
                return 0;
            }
            if (vendor.Id == 0)
            {
                await _context.Vendors.AddAsync(vendor);
                await _context.SaveChangesAsync();
                return 1;
            }
            else
            {
                _context.Vendors.Update(vendor);
                await _context.SaveChangesAsync();
                return 0;
            }

        }

        // Get Vendor by Admin
        public async Task<List<Vendor>> GetVendor(int id)
        {
            if (id == 1)
            {

                return await _context.Vendors.ToListAsync();
            }
            return await _context.Vendors.Where(w => w.HadAdminId == id).ToListAsync();

        }

        //Delete Vendor
        public async Task<bool> DeleteVendor(List<int> ids)
        {
            var vendors = await _context.Vendors
                                 .Where(v => ids.Contains(v.Id))
                                 .ToListAsync();

            if (!vendors.Any())
            {
                return false; // No vendors found to delete
            }

            _context.Vendors.RemoveRange(vendors);
            await _context.SaveChangesAsync();
            return true;
        }


        //Advance Filter Vendore
        public async Task<List<Vendor>> GetVendore(FilterDto filter)
        {
            var query = _context.Vendors.AsQueryable();

            // Filter by admin ID.
            if (filter.Id != null)  // Assuming Id is nullable in FilterDto
            {
                query = query.Where(item => item.HadAdminId == filter.Id);
            }

            if (!string.IsNullOrEmpty(filter.Name))
            {
                query = query.Where(w => w.Name.Contains(filter.Name));
            }
            if (!string.IsNullOrEmpty(filter.companyname))
            {
                query = query.Where(w => w.CompanyName == filter.companyname);
            }
            if (filter.contact != null)
            {
                query = query.Where(w => w.ContactNumber == filter.contact);
            }
            if (!string.IsNullOrEmpty(filter.Email))
            {
                query = query.Where(w => w.Email == filter.Email);
            }
            if (!string.IsNullOrEmpty(filter.Username))
            {
                query = query.Where(w => w.ContactPerson == filter.Username);
            }

            return await query.ToListAsync();
        }
    }
}

﻿using MaintenanceManagementApi.Common.ViewModel;
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
    public class LocationRepository : ILocationRepository
    {
        private readonly AppDbContext _context;

        public LocationRepository(AppDbContext context)
        {
            _context = context;
        }

        // Add new Location
        public async Task<int> Insert(Location location)
        {
            if (location.Id == 0)
            {
                await _context.Locations.AddAsync(location);
                _context.SaveChanges();
                return location.Id;
            }
            else
            {
                var existingLocation = await _context.Locations.FindAsync(location.Id);

                if (existingLocation != null)
                {

                    // Update other properties
                    _context.Entry(existingLocation).CurrentValues.SetValues(location);

                    // Save changes
                    await _context.SaveChangesAsync();  // Use async for better performance
                }
                return location.Id;
            }

        }

        //Get All Location by hadAdmin
        public async Task<List<Location>> GetAll()
        {
            return await _context.Locations.ToListAsync();
        }

        //Get By Admin id location
        public async Task<List<Location>> GetById(int id)
        {

            return await _context.Locations
                .Where(w => w.HadAdmin == id)
                .ToListAsync();
        }

        // Delete Location
        public async Task<bool> Delete(List<int> id)
        {
            var data = await _context.Locations.Where(a => id.Contains(a.Id)).ToListAsync();
            if (!data.Any())
            {
                return false;
            }

            _context.Locations.RemoveRange(data);
            await _context.SaveChangesAsync();
            return true;

        }

    }
}

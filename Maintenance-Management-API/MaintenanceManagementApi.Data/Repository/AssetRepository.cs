﻿using Azure.Core;
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
    public class AssetRepository : IAssetRepository
    {
        private readonly AppDbContext _context;

        public AssetRepository(AppDbContext context)
        {
            _context = context;
        }

        // Add new asset
        public async Task<int> Insert(Asset asset)
        {
            if (asset.Id == 0)
            {
                await _context.Assets.AddAsync(asset);
                _context.SaveChanges();
                return asset.Id;
            }
            else
            {
                var existingAsset = await _context.Assets.FindAsync(asset.Id);

                if (existingAsset != null)
                {
                    // Preserve the previous image if the new image is null
                    if (asset.AssetImage == "")
                    {
                        asset.AssetImage = existingAsset.AssetImage;
                    }

                    // Update other properties
                    _context.Entry(existingAsset).CurrentValues.SetValues(asset);

                    // Save changes
                    await _context.SaveChangesAsync();  // Use async for better performance
                }
                return asset.Id;
            }

        }

        //Get By Admin id assets
        public async Task<List<Asset>> GetById(int id)
        {
            var query = id == 1 ? _context.Assets : _context.Assets.Where(w => w.Hadadmin == id);
            return await query.ToListAsync();
        }

        //Delete Assets
        public async Task<int> DeleteAssets(List<int> id)
        {
            var assetsdata = await _context.Assets.Where(a => id.Contains(a.Id)).ToListAsync();
            if (!assetsdata.Any())
            {
                return 0;
            }

            _context.Assets.RemoveRange(assetsdata);
            await _context.SaveChangesAsync();
            return assetsdata.Count;

        }

        //Advance Filter Assets 
        public async Task<IEnumerable<Asset>> GetFilteredAssets(FilterDto filter)
        {
            // Start with a base query.
            var query = _context.Assets.AsQueryable();

            // Filter by admin ID.
            if (filter.Id != null)  // Assuming Id is nullable in FilterDto
            {
                query = query.Where(asset => asset.Hadadmin == filter.Id);
            }

            if (!string.IsNullOrEmpty(filter.AssetName))
            {
                query = query.Where(w => w.AssetName.Contains(filter.AssetName));
            }
            if (!string.IsNullOrEmpty(filter.Model))
            {
                query = query.Where(w => w.Model == filter.Model);
            }
            if (!string.IsNullOrEmpty(filter.SerialNumber))
            {
                query = query.Where(w => w.SerialNumber == filter.SerialNumber);
            }
            if (!string.IsNullOrEmpty(filter.Category))
            {
                query = query.Where(w => w.Category == filter.Category);
            }

            return await query.ToListAsync();
        }
    }
}
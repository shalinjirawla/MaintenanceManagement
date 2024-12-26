using MaintenanceManagementApi.Data.DBModel;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MaintenanceManagementApi.Data.DataDbContext
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Right> Rights { get; set; }
        public DbSet<RoleRight> RoleRights { get; set; }
        public DbSet<WorkRequest> WorkRequests { get; set; }
        public DbSet<Quotation> Quotations { get; set; }
        public DbSet<WorkOrder> WorkOrders { get; set; }
        public DbSet<CompletedWorkOrder> CompletedWorkOrders { get; set; }
        public DbSet<CustomerFeedback> CustomerFeedbacks { get; set; }
        public DbSet<Complaint> Complaints { get; set; }
        public DbSet<Asset> Assets { get; set; }
        public DbSet<PreventiveMaintenance> PreventiveMaintenances { get; set; }
        public DbSet<PMSchedule> PMSchedules { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<InventoryCategory> InventoryCategorys { get; set; }
        public DbSet<InventoryItem> InventoryItems { get; set; }
        public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
        public DbSet<PurchaseOrderItem> PurchaseOrderItems { get; set; }
        public DbSet<MaintenanceItem> MaintenanceItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuring composite key for Role_Rights table
            modelBuilder.Entity<RoleRight>()
                .HasKey(rr => new { rr.RoleID, rr.RightsID });

            // Configuring one-to-many relationship between Role and User
            modelBuilder.Entity<Role>()
                .HasMany(r => r.Users)
                .WithOne(u => u.Role)
                .HasForeignKey(u => u.RoleID)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuring many-to-many relationship between Role and Right
            modelBuilder.Entity<RoleRight>()
                .HasOne(rr => rr.Role)
                .WithMany(r => r.RoleRights)
                .HasForeignKey(rr => rr.RoleID);

            modelBuilder.Entity<RoleRight>()
                .HasOne(rr => rr.Right)
                .WithMany(r => r.RoleRights)
                .HasForeignKey(rr => rr.RightsID);

            modelBuilder.Entity<User>()
                .HasOne(u => u.HadAdmin)
                .WithMany()
                .HasForeignKey(u => u.HadAdminId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<WorkRequest>()
               .HasOne(u => u.HadAdmin)
               .WithMany()
               .HasForeignKey(u => u.HadAdminId)
               .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<WorkRequest>()
                .Property(w => w.EstimatedCost)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<CompletedWorkOrder>()
                  .HasOne(u => u.WorkOrder)
                  .WithMany()
                  .HasForeignKey(u => u.WorkOrderId)
                  .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CustomerFeedback>()
                 .HasOne(u => u.WorkRequestFeed)
                 .WithMany()
                 .HasForeignKey(u => u.WorkRequestID)
                 .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Complaint>()
                .HasOne(u => u.WorkRequestFeed)
                .WithMany()
                .HasForeignKey(u => u.WorkRequestID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Complaint>()
                .HasOne(u => u.RequesterUser)
                .WithMany()
                .HasForeignKey(u => u.CustomerID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PMSchedule>()
                .HasOne(pm => pm.PreventiveMaintenance)
                .WithMany(p => p.PMSchedules)
                .HasForeignKey(pm => pm.PMId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<InventoryItem>()
                .HasOne(i => i.InventoryCategory)
                .WithMany()
                .HasForeignKey(i => i.InventoryCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PurchaseOrder>()
                .HasOne(i => i.Vendor)
                .WithMany()
                .HasForeignKey(i => i.VendorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<MaintenanceItem>()
               .HasOne(i => i.CompletedWorkOrder)
               .WithMany()
               .HasForeignKey(i => i.CompletedWorkOrderId)
               .OnDelete(DeleteBehavior.Restrict);

        }

    }
}

﻿// <auto-generated />
using System;
using MaintenanceManagementApi.Data.DataDbContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace MaintenanceManagementApi.Data.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20241108043031_pmscheduletabladd")]
    partial class pmscheduletabladd
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.Asset", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("AssetImage")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("AssetName")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("Category")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Condition")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Hadadmin")
                        .HasColumnType("int");

                    b.Property<string>("Location")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Model")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("PurchaseDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("SerialNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("WarrantyExpiration")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.ToTable("Assets");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.Complaint", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Attachment")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("ComplaintDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("CustomerID")
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Priority")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("WorkRequestID")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("CustomerID");

                    b.HasIndex("WorkRequestID");

                    b.ToTable("Complaints");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.CompletedWorkOrder", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ActualLaborHours")
                        .HasColumnType("int");

                    b.Property<string>("AdminReviewStatus")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ChallengesEncountered")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("CompletionDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("DescriptionOfOccurrence")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ExtraWorkDetails")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("NotesComments")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PlanDeviations")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ProofOfCompletion")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SparePartsMaterialsUsed")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Status")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("WorkHours")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("WorkOrderId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("WorkOrderId");

                    b.ToTable("CompletedWorkOrders");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.CustomerFeedback", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Comments")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("CustomerID")
                        .HasColumnType("int");

                    b.Property<DateTime>("FeedbackDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("InFuture")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ResolutionNotes")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("ResolvedStatus")
                        .HasColumnType("int");

                    b.Property<string>("Satisfied")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("WorkRequestID")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("CustomerID");

                    b.HasIndex("WorkRequestID");

                    b.ToTable("CustomerFeedbacks");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.PMSchedule", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("AdvanceCreationPeriod")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("DaysOfWeek")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("FrequencyInterval")
                        .HasColumnType("int");

                    b.Property<string>("FrequencyType")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("LastGeneratedDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime?>("NextDueDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("PMId")
                        .HasColumnType("int");

                    b.Property<string>("ScheduleType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("WOId")
                        .HasColumnType("int");

                    b.Property<int>("WorkOrderDue")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("PMId");

                    b.ToTable("PMSchedules");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.PreventiveMaintenance", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("Asset")
                        .HasColumnType("int");

                    b.Property<int>("AssignTo")
                        .HasColumnType("int");

                    b.Property<string>("Category")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("DueDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("Location")
                        .HasColumnType("int");

                    b.Property<string>("Priority")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("PreventiveMaintenances");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.Quotation", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Body")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Recipient")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("RequestId")
                        .HasColumnType("int");

                    b.Property<string>("Sender")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<string>("Subject")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("RequestId");

                    b.ToTable("Quotations");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.Right", b =>
                {
                    b.Property<int>("RightsID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RightsID"));

                    b.Property<string>("RightsName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("RightsID");

                    b.ToTable("Rights");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.Role", b =>
                {
                    b.Property<int>("RoleID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("RoleID"));

                    b.Property<string>("RoleName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("RoleID");

                    b.ToTable("Roles");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.RoleRight", b =>
                {
                    b.Property<int>("RoleID")
                        .HasColumnType("int");

                    b.Property<int>("RightsID")
                        .HasColumnType("int");

                    b.HasKey("RoleID", "RightsID");

                    b.HasIndex("RightsID");

                    b.ToTable("RoleRights");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.User", b =>
                {
                    b.Property<int>("UserID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UserID"));

                    b.Property<DateTime?>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("HadAdminId")
                        .HasColumnType("int");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("RoleID")
                        .HasColumnType("int");

                    b.Property<DateTime?>("UpdatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserID");

                    b.HasIndex("HadAdminId");

                    b.HasIndex("RoleID");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.WorkOrder", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("AdditionalWorkers")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Asset")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("AssignedTo")
                        .HasColumnType("int");

                    b.Property<string>("Category")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Comment")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("DateCreated")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("DueDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Location")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Priority")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("RequestedId")
                        .HasColumnType("int");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Status")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Team")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Title")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("AssignedTo");

                    b.ToTable("WorkOrders");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.WorkRequest", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int?>("ApprovedBy")
                        .HasColumnType("int");

                    b.Property<DateTime?>("ApprovedDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Comment")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("CreatedBy")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<decimal?>("EstimatedCost")
                        .HasColumnType("decimal(18,2)");

                    b.Property<int>("HadAdminId")
                        .HasColumnType("int");

                    b.Property<string>("Image")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("Location")
                        .HasColumnType("int");

                    b.Property<string>("Priority")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Status")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("ApprovedBy");

                    b.HasIndex("CreatedBy");

                    b.HasIndex("HadAdminId");

                    b.ToTable("WorkRequests");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.Complaint", b =>
                {
                    b.HasOne("MaintenanceManagementApi.Data.DBModel.User", "RequesterUser")
                        .WithMany()
                        .HasForeignKey("CustomerID")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("MaintenanceManagementApi.Data.DBModel.WorkRequest", "WorkRequestFeed")
                        .WithMany()
                        .HasForeignKey("WorkRequestID")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("RequesterUser");

                    b.Navigation("WorkRequestFeed");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.CompletedWorkOrder", b =>
                {
                    b.HasOne("MaintenanceManagementApi.Data.DBModel.WorkOrder", "WorkOrder")
                        .WithMany()
                        .HasForeignKey("WorkOrderId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("WorkOrder");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.CustomerFeedback", b =>
                {
                    b.HasOne("MaintenanceManagementApi.Data.DBModel.User", "RequesterUser")
                        .WithMany()
                        .HasForeignKey("CustomerID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MaintenanceManagementApi.Data.DBModel.WorkRequest", "WorkRequestFeed")
                        .WithMany()
                        .HasForeignKey("WorkRequestID")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("RequesterUser");

                    b.Navigation("WorkRequestFeed");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.PMSchedule", b =>
                {
                    b.HasOne("MaintenanceManagementApi.Data.DBModel.PreventiveMaintenance", "PreventiveMaintenance")
                        .WithMany("PMSchedules")
                        .HasForeignKey("PMId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("PreventiveMaintenance");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.Quotation", b =>
                {
                    b.HasOne("MaintenanceManagementApi.Data.DBModel.WorkRequest", "WorkRequest")
                        .WithMany()
                        .HasForeignKey("RequestId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("WorkRequest");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.RoleRight", b =>
                {
                    b.HasOne("MaintenanceManagementApi.Data.DBModel.Right", "Right")
                        .WithMany("RoleRights")
                        .HasForeignKey("RightsID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MaintenanceManagementApi.Data.DBModel.Role", "Role")
                        .WithMany("RoleRights")
                        .HasForeignKey("RoleID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Right");

                    b.Navigation("Role");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.User", b =>
                {
                    b.HasOne("MaintenanceManagementApi.Data.DBModel.User", "HadAdmin")
                        .WithMany()
                        .HasForeignKey("HadAdminId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("MaintenanceManagementApi.Data.DBModel.Role", "Role")
                        .WithMany("Users")
                        .HasForeignKey("RoleID")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("HadAdmin");

                    b.Navigation("Role");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.WorkOrder", b =>
                {
                    b.HasOne("MaintenanceManagementApi.Data.DBModel.User", "AssignedToUser")
                        .WithMany()
                        .HasForeignKey("AssignedTo")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AssignedToUser");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.WorkRequest", b =>
                {
                    b.HasOne("MaintenanceManagementApi.Data.DBModel.User", "ApprovedByUser")
                        .WithMany()
                        .HasForeignKey("ApprovedBy");

                    b.HasOne("MaintenanceManagementApi.Data.DBModel.User", "CreatedByUser")
                        .WithMany()
                        .HasForeignKey("CreatedBy")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("MaintenanceManagementApi.Data.DBModel.User", "HadAdmin")
                        .WithMany()
                        .HasForeignKey("HadAdminId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("ApprovedByUser");

                    b.Navigation("CreatedByUser");

                    b.Navigation("HadAdmin");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.PreventiveMaintenance", b =>
                {
                    b.Navigation("PMSchedules");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.Right", b =>
                {
                    b.Navigation("RoleRights");
                });

            modelBuilder.Entity("MaintenanceManagementApi.Data.DBModel.Role", b =>
                {
                    b.Navigation("RoleRights");

                    b.Navigation("Users");
                });
#pragma warning restore 612, 618
        }
    }
}

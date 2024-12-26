using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MaintenanceManagementApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class pmscheduletabladd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PreventiveMaintenances",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Priority = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Asset = table.Column<int>(type: "int", nullable: false),
                    Location = table.Column<int>(type: "int", nullable: false),
                    AssignTo = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PreventiveMaintenances", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PMSchedules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ScheduleType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FrequencyInterval = table.Column<int>(type: "int", nullable: true),
                    FrequencyType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DaysOfWeek = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WorkOrderDue = table.Column<int>(type: "int", nullable: false),
                    AdvanceCreationPeriod = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NextDueDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastGeneratedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PMId = table.Column<int>(type: "int", nullable: false),
                    WOId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PMSchedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PMSchedules_PreventiveMaintenances_PMId",
                        column: x => x.PMId,
                        principalTable: "PreventiveMaintenances",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PMSchedules_PMId",
                table: "PMSchedules",
                column: "PMId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PMSchedules");

            migrationBuilder.DropTable(
                name: "PreventiveMaintenances");
        }
    }
}

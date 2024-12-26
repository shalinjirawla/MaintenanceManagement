using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MaintenanceManagementApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class pmscheduletablupdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "PreventiveMaintenances",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_PreventiveMaintenances_CreatedBy",
                table: "PreventiveMaintenances",
                column: "CreatedBy");

            migrationBuilder.AddForeignKey(
                name: "FK_PreventiveMaintenances_Users_CreatedBy",
                table: "PreventiveMaintenances",
                column: "CreatedBy",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PreventiveMaintenances_Users_CreatedBy",
                table: "PreventiveMaintenances");

            migrationBuilder.DropIndex(
                name: "IX_PreventiveMaintenances_CreatedBy",
                table: "PreventiveMaintenances");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "PreventiveMaintenances");
        }
    }
}

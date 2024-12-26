using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MaintenanceManagementApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class addtexesfieldinventoryitem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "VendorId",
                table: "InventoryItems");

            migrationBuilder.AddColumn<decimal>(
                name: "Taxes",
                table: "InventoryItems",
                type: "decimal(18,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Taxes",
                table: "InventoryItems");

            migrationBuilder.AddColumn<int>(
                name: "VendorId",
                table: "InventoryItems",
                type: "int",
                nullable: true);
        }
    }
}

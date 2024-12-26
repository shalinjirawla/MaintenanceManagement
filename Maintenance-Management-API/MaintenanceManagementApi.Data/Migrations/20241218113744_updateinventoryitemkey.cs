using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MaintenanceManagementApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class updateinventoryitemkey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryItems_InventoryCategorys_InventoryCategoryId",
                table: "InventoryItems");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "InventoryItems");

            migrationBuilder.AlterColumn<int>(
                name: "InventoryCategoryId",
                table: "InventoryItems",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryItems_InventoryCategorys_InventoryCategoryId",
                table: "InventoryItems",
                column: "InventoryCategoryId",
                principalTable: "InventoryCategorys",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryItems_InventoryCategorys_InventoryCategoryId",
                table: "InventoryItems");

            migrationBuilder.AlterColumn<int>(
                name: "InventoryCategoryId",
                table: "InventoryItems",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "InventoryItems",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryItems_InventoryCategorys_InventoryCategoryId",
                table: "InventoryItems",
                column: "InventoryCategoryId",
                principalTable: "InventoryCategorys",
                principalColumn: "Id");
        }
    }
}

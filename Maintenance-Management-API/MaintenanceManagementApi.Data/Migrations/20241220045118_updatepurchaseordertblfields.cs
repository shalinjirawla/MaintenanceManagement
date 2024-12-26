using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MaintenanceManagementApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class updatepurchaseordertblfields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PurchaseOrders_InventoryItems_InventoryItemId",
                table: "PurchaseOrders");

            migrationBuilder.DropIndex(
                name: "IX_PurchaseOrders_InventoryItemId",
                table: "PurchaseOrders");

            migrationBuilder.DropColumn(
                name: "Cost",
                table: "PurchaseOrders");

            migrationBuilder.DropColumn(
                name: "InventoryItemId",
                table: "PurchaseOrders");

            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "PurchaseOrders");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Cost",
                table: "PurchaseOrders",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "InventoryItemId",
                table: "PurchaseOrders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "PurchaseOrders",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrders_InventoryItemId",
                table: "PurchaseOrders",
                column: "InventoryItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_PurchaseOrders_InventoryItems_InventoryItemId",
                table: "PurchaseOrders",
                column: "InventoryItemId",
                principalTable: "InventoryItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

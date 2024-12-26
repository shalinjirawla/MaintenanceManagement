using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MaintenanceManagementApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class addkeyinworkordertabl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkOrders_WorkRequests_RequestedId",
                table: "WorkOrders");

            migrationBuilder.DropIndex(
                name: "IX_WorkOrders_RequestedId",
                table: "WorkOrders");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_AssignedTo",
                table: "WorkOrders",
                column: "AssignedTo");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkOrders_Users_AssignedTo",
                table: "WorkOrders",
                column: "AssignedTo",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkOrders_Users_AssignedTo",
                table: "WorkOrders");

            migrationBuilder.DropIndex(
                name: "IX_WorkOrders_AssignedTo",
                table: "WorkOrders");

            migrationBuilder.CreateIndex(
                name: "IX_WorkOrders_RequestedId",
                table: "WorkOrders",
                column: "RequestedId");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkOrders_WorkRequests_RequestedId",
                table: "WorkOrders",
                column: "RequestedId",
                principalTable: "WorkRequests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

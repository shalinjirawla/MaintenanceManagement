using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MaintenanceManagementApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class addfieldinrequester : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HadAdminId",
                table: "WorkRequests",
                type: "int",
                nullable: false,
                defaultValue: 0);
            migrationBuilder.Sql("UPDATE WorkRequests SET HadAdminId = 1");
            migrationBuilder.CreateIndex(
                name: "IX_WorkRequests_HadAdminId",
                table: "WorkRequests",
                column: "HadAdminId");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkRequests_Users_HadAdminId",
                table: "WorkRequests",
                column: "HadAdminId",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkRequests_Users_HadAdminId",
                table: "WorkRequests");

            migrationBuilder.DropIndex(
                name: "IX_WorkRequests_HadAdminId",
                table: "WorkRequests");

            migrationBuilder.DropColumn(
                name: "HadAdminId",
                table: "WorkRequests");
        }
    }
}

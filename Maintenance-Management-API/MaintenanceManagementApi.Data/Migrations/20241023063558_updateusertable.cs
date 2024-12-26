using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MaintenanceManagementApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class updateusertable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HadAdminId",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);
            migrationBuilder.Sql("UPDATE Users SET HadAdminId = 1");
            migrationBuilder.CreateIndex(
                name: "IX_Users_HadAdminId",
                table: "Users",
                column: "HadAdminId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Users_HadAdminId",
                table: "Users",
                column: "HadAdminId",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
            name: "FK_Users_Users_HadAdminId",
            table: "Users");

            // Drop the HadAdminId column
            migrationBuilder.DropColumn(
                name: "HadAdminId",
                table: "Users");
        }
    }
}

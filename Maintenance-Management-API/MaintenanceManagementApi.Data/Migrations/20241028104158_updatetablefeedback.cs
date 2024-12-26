using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MaintenanceManagementApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class updatetablefeedback : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CustomerFeedbacks_WorkOrders_WorkorderID",
                table: "CustomerFeedbacks");

            migrationBuilder.RenameColumn(
                name: "WorkorderID",
                table: "CustomerFeedbacks",
                newName: "WorkRequestID");

            migrationBuilder.RenameIndex(
                name: "IX_CustomerFeedbacks_WorkorderID",
                table: "CustomerFeedbacks",
                newName: "IX_CustomerFeedbacks_WorkRequestID");

            migrationBuilder.AddForeignKey(
                name: "FK_CustomerFeedbacks_WorkRequests_WorkRequestID",
                table: "CustomerFeedbacks",
                column: "WorkRequestID",
                principalTable: "WorkRequests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CustomerFeedbacks_WorkRequests_WorkRequestID",
                table: "CustomerFeedbacks");

            migrationBuilder.RenameColumn(
                name: "WorkRequestID",
                table: "CustomerFeedbacks",
                newName: "WorkorderID");

            migrationBuilder.RenameIndex(
                name: "IX_CustomerFeedbacks_WorkRequestID",
                table: "CustomerFeedbacks",
                newName: "IX_CustomerFeedbacks_WorkorderID");

            migrationBuilder.AddForeignKey(
                name: "FK_CustomerFeedbacks_WorkOrders_WorkorderID",
                table: "CustomerFeedbacks",
                column: "WorkorderID",
                principalTable: "WorkOrders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

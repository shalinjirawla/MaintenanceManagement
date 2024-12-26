using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MaintenanceManagementApi.Data.Migrations
{
    /// <inheritdoc />
    public partial class createcomplateworkoerfeedbacktbl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CompletedWorkOrders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WorkOrderId = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CompletionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NotesComments = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProofOfCompletion = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AdminReviewStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DescriptionOfOccurrence = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ChallengesEncountered = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SparePartsMaterialsUsed = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExtraWorkDetails = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PlanDeviations = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ActualLaborHours = table.Column<int>(type: "int", nullable: false),
                    WorkHours = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompletedWorkOrders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CompletedWorkOrders_WorkOrders_WorkOrderId",
                        column: x => x.WorkOrderId,
                        principalTable: "WorkOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CustomerFeedbacks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CustomerID = table.Column<int>(type: "int", nullable: false),
                    FeedbackType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FeedbackDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: true),
                    Comments = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ResolvedStatus = table.Column<int>(type: "int", nullable: true),
                    ResolutionNotes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerFeedbacks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomerFeedbacks_Users_CustomerID",
                        column: x => x.CustomerID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CompletedWorkOrders_WorkOrderId",
                table: "CompletedWorkOrders",
                column: "WorkOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerFeedbacks_CustomerID",
                table: "CustomerFeedbacks",
                column: "CustomerID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompletedWorkOrders");

            migrationBuilder.DropTable(
                name: "CustomerFeedbacks");
        }
    }
}

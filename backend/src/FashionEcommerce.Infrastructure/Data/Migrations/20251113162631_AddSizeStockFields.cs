using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FashionEcommerce.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSizeStockFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StockL",
                table: "SpecialCollectionProducts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "StockM",
                table: "SpecialCollectionProducts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "StockS",
                table: "SpecialCollectionProducts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "StockXL",
                table: "SpecialCollectionProducts",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StockL",
                table: "SpecialCollectionProducts");

            migrationBuilder.DropColumn(
                name: "StockM",
                table: "SpecialCollectionProducts");

            migrationBuilder.DropColumn(
                name: "StockS",
                table: "SpecialCollectionProducts");

            migrationBuilder.DropColumn(
                name: "StockXL",
                table: "SpecialCollectionProducts");
        }
    }
}

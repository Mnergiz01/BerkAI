using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FashionEcommerce.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddProductIdToSpecialCollection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ProductId",
                table: "SpecialCollectionProducts",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SpecialCollectionProducts_ProductId",
                table: "SpecialCollectionProducts",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_SpecialCollectionProducts_Products_ProductId",
                table: "SpecialCollectionProducts",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SpecialCollectionProducts_Products_ProductId",
                table: "SpecialCollectionProducts");

            migrationBuilder.DropIndex(
                name: "IX_SpecialCollectionProducts_ProductId",
                table: "SpecialCollectionProducts");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "SpecialCollectionProducts");
        }
    }
}

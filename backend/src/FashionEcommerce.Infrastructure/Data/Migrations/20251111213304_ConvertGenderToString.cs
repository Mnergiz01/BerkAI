using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FashionEcommerce.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class ConvertGenderToString : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Mevcut integer değerleri geçici sütuna kopyala
            migrationBuilder.AddColumn<int>(
                name: "GenderTemp",
                table: "Users",
                type: "integer",
                nullable: true);

            migrationBuilder.Sql(@"UPDATE ""Users"" SET ""GenderTemp"" = ""Gender""");

            // Gender sütununu string'e çevir
            migrationBuilder.AlterColumn<string>(
                name: "Gender",
                table: "Users",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            // Integer değerleri string'e çevir
            migrationBuilder.Sql(@"
                UPDATE ""Users""
                SET ""Gender"" = CASE ""GenderTemp""
                    WHEN 1 THEN 'Male'
                    WHEN 2 THEN 'Female'
                    WHEN 3 THEN 'PreferNotToSay'
                    WHEN 4 THEN 'PreferNotToSay'
                    ELSE NULL
                END");

            // Geçici sütunu sil
            migrationBuilder.DropColumn(
                name: "GenderTemp",
                table: "Users");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "Gender",
                table: "Users",
                type: "integer",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}

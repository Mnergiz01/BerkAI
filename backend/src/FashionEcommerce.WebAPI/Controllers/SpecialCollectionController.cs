using FashionEcommerce.Domain.Entities;
using FashionEcommerce.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FashionEcommerce.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SpecialCollectionController : ControllerBase
{
    private readonly FashionEcommerceDbContext _context;

    public SpecialCollectionController(FashionEcommerceDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Tüm özel koleksiyon ürünlerini listele
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _context.SpecialCollectionProducts
            .Where(p => !p.IsDeleted && p.IsActive)
            .OrderBy(p => p.DisplayOrder)
            .ToListAsync();

        return Ok(products);
    }

    /// <summary>
    /// ID'ye göre ürün getir
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var product = await _context.SpecialCollectionProducts
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);

        if (product == null)
            return NotFound();

        return Ok(product);
    }

    /// <summary>
    /// Yeni ürün ekle
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] SpecialCollectionProduct product)
    {
        product.Id = Guid.NewGuid();
        product.CreatedAt = DateTime.UtcNow;

        // "Special Collection" category ve brand'i bul veya oluştur
        var category = await _context.Categories.FirstOrDefaultAsync(c => c.Name == "Special Collection");
        if (category == null)
        {
            category = new Category
            {
                Name = "Special Collection",
                Slug = "special-collection",
                Gender = Domain.Enums.Gender.Male,
                CreatedAt = DateTime.UtcNow
            };
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
        }

        var brand = await _context.Brands.FirstOrDefaultAsync(b => b.Name == "Made in Root");
        if (brand == null)
        {
            brand = new Brand
            {
                Name = "Made in Root",
                Slug = "made-in-root",
                CreatedAt = DateTime.UtcNow
            };
            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();
        }

        // Aynı zamanda Product tablosuna da ekle
        var normalProduct = new Product
        {
            Name = product.Name,
            Slug = product.Id.ToString(), // Special collection ID'sini slug olarak kullan
            Description = product.Description ?? "",
            Price = product.Price,
            SKU = $"SC-{product.Id.ToString().Substring(0, 8)}",
            StockQuantity = product.StockS + product.StockM + product.StockL + product.StockXL,
            Gender = Domain.Enums.Gender.Male,
            IsFeatured = true,
            IsActive = product.IsActive,
            CategoryId = category.Id,
            BrandId = brand.Id,
            CreatedAt = DateTime.UtcNow
        };

        _context.Products.Add(normalProduct);
        await _context.SaveChangesAsync();

        // İlk resmi ProductImage olarak ekle
        if (product.ImagePaths.Any())
        {
            var mainImage = new ProductImage
            {
                ProductId = normalProduct.Id,
                ImageUrl = product.ImagePaths[0],
                DisplayOrder = 0,
                IsMainImage = true,
                CreatedAt = DateTime.UtcNow
            };
            _context.ProductImages.Add(mainImage);
            await _context.SaveChangesAsync();
        }

        // ProductId'yi ayarla
        product.ProductId = normalProduct.Id;
        _context.SpecialCollectionProducts.Add(product);
        await _context.SaveChangesAsync();

        // Navigation property'leri temizle (circular reference hatası önlemek için)
        product.Product = null;

        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    /// <summary>
    /// Ürünü güncelle
    /// </summary>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] SpecialCollectionProduct product)
    {
        var existing = await _context.SpecialCollectionProducts
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);

        if (existing == null)
            return NotFound();

        existing.Name = product.Name;
        existing.Price = product.Price;
        existing.Description = product.Description;
        existing.ImagePaths = product.ImagePaths;
        existing.DisplayOrder = product.DisplayOrder;
        existing.IsActive = product.IsActive;
        existing.StockS = product.StockS;
        existing.StockM = product.StockM;
        existing.StockL = product.StockL;
        existing.StockXL = product.StockXL;
        existing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(existing);
    }

    /// <summary>
    /// Ürünü sil (hard delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var product = await _context.SpecialCollectionProducts
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);

        if (product == null)
            return NotFound();

        // İlişkili Product varsa onu ve ProductImage'larını da sil
        if (product.ProductId.HasValue)
        {
            var relatedProduct = await _context.Products
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == product.ProductId.Value);

            if (relatedProduct != null)
            {
                // ProductImage'ları sil
                if (relatedProduct.Images.Any())
                {
                    _context.ProductImages.RemoveRange(relatedProduct.Images);
                }

                // Product'ı sil
                _context.Products.Remove(relatedProduct);
            }
        }

        // SpecialCollectionProduct'ı sil
        _context.SpecialCollectionProducts.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    /// <summary>
    /// Fotoğraf yükle
    /// </summary>
    [HttpPost("upload")]
    public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded");

        // Dosya uzantısı kontrolü
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
            return BadRequest("Invalid file type. Only jpg, jpeg, png, webp are allowed");

        // Benzersiz dosya adı oluştur
        var fileName = $"{Guid.NewGuid()}{extension}";
        var uploadPath = Path.Combine("wwwroot", "uploads", "special-collection");
        var fullPath = Path.Combine(uploadPath, fileName);

        // Klasör yoksa oluştur
        Directory.CreateDirectory(uploadPath);

        // Dosyayı kaydet
        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // URL'i döndür
        var imageUrl = $"/uploads/special-collection/{fileName}";
        return Ok(new { url = imageUrl });
    }
}

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

        _context.SpecialCollectionProducts.Add(product);
        await _context.SaveChangesAsync();

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
    /// Ürünü sil (soft delete)
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var product = await _context.SpecialCollectionProducts
            .FirstOrDefaultAsync(p => p.Id == id && !p.IsDeleted);

        if (product == null)
            return NotFound();

        product.IsDeleted = true;
        product.UpdatedAt = DateTime.UtcNow;

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

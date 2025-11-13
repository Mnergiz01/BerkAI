using FashionEcommerce.Domain.Common;

namespace FashionEcommerce.Domain.Entities;

public class SpecialCollectionProduct : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string? Description { get; set; }
    public List<string> ImagePaths { get; set; } = new();
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;

    // Beden stoklarÄ±
    public int StockS { get; set; } = 0;
    public int StockM { get; set; } = 0;
    public int StockL { get; set; } = 0;
    public int StockXL { get; set; } = 0;
}

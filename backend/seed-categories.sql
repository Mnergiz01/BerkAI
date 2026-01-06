-- Kadın Kategorileri
INSERT INTO "Categories" ("Name", "Slug", "Description", "Gender", "ImageUrl", "CreatedAt", "UpdatedAt", "IsDeleted")
SELECT 'Elbise', 'elbise', 'Kadın elbiseleri', 'Female', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500', NOW(), NOW(), false
WHERE NOT EXISTS (SELECT 1 FROM "Categories" WHERE "Slug" = 'elbise');

INSERT INTO "Categories" ("Name", "Slug", "Description", "Gender", "ImageUrl", "CreatedAt", "UpdatedAt", "IsDeleted")
SELECT 'Bluz', 'bluz', 'Kadın bluzları', 'Female', 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=500', NOW(), NOW(), false
WHERE NOT EXISTS (SELECT 1 FROM "Categories" WHERE "Slug" = 'bluz');

INSERT INTO "Categories" ("Name", "Slug", "Description", "Gender", "ImageUrl", "CreatedAt", "UpdatedAt", "IsDeleted")
SELECT 'Pantolon', 'pantolon-kadin', 'Kadın pantolonları', 'Female', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500', NOW(), NOW(), false
WHERE NOT EXISTS (SELECT 1 FROM "Categories" WHERE "Slug" = 'pantolon-kadin');

INSERT INTO "Categories" ("Name", "Slug", "Description", "Gender", "ImageUrl", "CreatedAt", "UpdatedAt", "IsDeleted")
SELECT 'Etek', 'etek', 'Kadın etekleri', 'Female', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500', NOW(), NOW(), false
WHERE NOT EXISTS (SELECT 1 FROM "Categories" WHERE "Slug" = 'etek');

INSERT INTO "Categories" ("Name", "Slug", "Description", "Gender", "ImageUrl", "CreatedAt", "UpdatedAt", "IsDeleted")
SELECT 'Ceket', 'ceket-kadin', 'Kadın ceketleri', 'Female', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500', NOW(), NOW(), false
WHERE NOT EXISTS (SELECT 1 FROM "Categories" WHERE "Slug" = 'ceket-kadin');

INSERT INTO "Categories" ("Name", "Slug", "Description", "Gender", "ImageUrl", "CreatedAt", "UpdatedAt", "IsDeleted")
SELECT 'Ayakkabı', 'ayakkabi-kadin', 'Kadın ayakkabıları', 'Female', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500', NOW(), NOW(), false
WHERE NOT EXISTS (SELECT 1 FROM "Categories" WHERE "Slug" = 'ayakkabi-kadin');

-- Erkek Kategorileri
INSERT INTO "Categories" ("Name", "Slug", "Description", "Gender", "ImageUrl", "CreatedAt", "UpdatedAt", "IsDeleted")
SELECT 'T-Shirt', 't-shirt', 'Erkek t-shirtleri', 'Male', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', NOW(), NOW(), false
WHERE NOT EXISTS (SELECT 1 FROM "Categories" WHERE "Slug" = 't-shirt');

INSERT INTO "Categories" ("Name", "Slug", "Description", "Gender", "ImageUrl", "CreatedAt", "UpdatedAt", "IsDeleted")
SELECT 'Gömlek', 'gomlek', 'Erkek gömlekleri', 'Male', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500', NOW(), NOW(), false
WHERE NOT EXISTS (SELECT 1 FROM "Categories" WHERE "Slug" = 'gomlek');

INSERT INTO "Categories" ("Name", "Slug", "Description", "Gender", "ImageUrl", "CreatedAt", "UpdatedAt", "IsDeleted")
SELECT 'Pantolon', 'pantolon-erkek', 'Erkek pantolonları', 'Male', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500', NOW(), NOW(), false
WHERE NOT EXISTS (SELECT 1 FROM "Categories" WHERE "Slug" = 'pantolon-erkek');

INSERT INTO "Categories" ("Name", "Slug", "Description", "Gender", "ImageUrl", "CreatedAt", "UpdatedAt", "IsDeleted")
SELECT 'Ceket', 'ceket-erkek', 'Erkek ceketleri', 'Male', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', NOW(), NOW(), false
WHERE NOT EXISTS (SELECT 1 FROM "Categories" WHERE "Slug" = 'ceket-erkek');

INSERT INTO "Categories" ("Name", "Slug", "Description", "Gender", "ImageUrl", "CreatedAt", "UpdatedAt", "IsDeleted")
SELECT 'Ayakkabı', 'ayakkabi-erkek', 'Erkek ayakkabıları', 'Male', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500', NOW(), NOW(), false
WHERE NOT EXISTS (SELECT 1 FROM "Categories" WHERE "Slug" = 'ayakkabi-erkek');

INSERT INTO "Categories" ("Name", "Slug", "Description", "Gender", "ImageUrl", "CreatedAt", "UpdatedAt", "IsDeleted")
SELECT 'Kazak', 'kazak', 'Erkek kazakları', 'Male', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500', NOW(), NOW(), false
WHERE NOT EXISTS (SELECT 1 FROM "Categories" WHERE "Slug" = 'kazak');

-- Aksesuar Kategorileri (Unisex)
INSERT INTO "Categories" ("Name", "Slug", "Description", "Gender", "ImageUrl", "CreatedAt", "UpdatedAt", "IsDeleted")
SELECT 'Çanta', 'canta', 'Çantalar', 'Unisex', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500', NOW(), NOW(), false
WHERE NOT EXISTS (SELECT 1 FROM "Categories" WHERE "Slug" = 'canta');

INSERT INTO "Categories" ("Name", "Slug", "Description", "Gender", "ImageUrl", "CreatedAt", "UpdatedAt", "IsDeleted")
SELECT 'Saat', 'saat', 'Saatler', 'Unisex', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', NOW(), NOW(), false
WHERE NOT EXISTS (SELECT 1 FROM "Categories" WHERE "Slug" = 'saat');

INSERT INTO "Categories" ("Name", "Slug", "Description", "Gender", "ImageUrl", "CreatedAt", "UpdatedAt", "IsDeleted")
SELECT 'Gözlük', 'gozluk', 'Güneş gözlükleri', 'Unisex', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500', NOW(), NOW(), false
WHERE NOT EXISTS (SELECT 1 FROM "Categories" WHERE "Slug" = 'gozluk');

INSERT INTO "Categories" ("Name", "Slug", "Description", "Gender", "ImageUrl", "CreatedAt", "UpdatedAt", "IsDeleted")
SELECT 'Şapka', 'sapka', 'Şapkalar', 'Unisex', 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500', NOW(), NOW(), false
WHERE NOT EXISTS (SELECT 1 FROM "Categories" WHERE "Slug" = 'sapka');

INSERT INTO "Categories" ("Name", "Slug", "Description", "Gender", "ImageUrl", "CreatedAt", "UpdatedAt", "IsDeleted")
SELECT 'Kemer', 'kemer', 'Kemerler', 'Unisex', 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500', NOW(), NOW(), false
WHERE NOT EXISTS (SELECT 1 FROM "Categories" WHERE "Slug" = 'kemer');

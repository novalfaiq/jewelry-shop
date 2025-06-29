-- Schema for Jewelry Shop Database

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Product Types Table
CREATE TABLE product_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  product_type_id UUID NOT NULL REFERENCES product_types(id),
  image_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Subscribers Table
CREATE TABLE newsletter (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_product_types_name ON product_types(name);
CREATE INDEX IF NOT EXISTS idx_products_product_type_id ON products(product_type_id);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_newsletter_email ON newsletter(email);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_types_modtime
    BEFORE UPDATE ON product_types
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_products_modtime
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Storage bucket for product type images
-- Run this in Supabase SQL Editor
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('product-type-images', 'product-type-images', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Storage policies for product-type-images bucket
-- Policy for viewing/downloading images (public access)
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'product-type-images');

-- Policy for uploading images (authenticated users only)
CREATE POLICY "Authenticated Users Can Upload" ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'product-type-images' 
        AND auth.role() = 'authenticated'
    );

-- Policy for updating images (authenticated users only)
CREATE POLICY "Authenticated Users Can Update" ON storage.objects
    FOR UPDATE
    USING (
        bucket_id = 'product-type-images'
        AND auth.role() = 'authenticated'
    )
    WITH CHECK (
        bucket_id = 'product-type-images'
        AND auth.role() = 'authenticated'
    );

-- Policy for deleting images (authenticated users only)
CREATE POLICY "Authenticated Users Can Delete" ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'product-type-images'
        AND auth.role() = 'authenticated'
    );

-- Sample data insertion (optional)
INSERT INTO product_types (name, description)
VALUES 
    ('Rings', 'Beautiful collection of rings'),
    ('Necklaces', 'Elegant necklaces for all occasions'),
    ('Bracelets', 'Stylish bracelets and bangles'),
    ('Earrings', 'Stunning earrings collection')
ON CONFLICT DO NOTHING;

-- Helper functions

-- Function to get all product types with their product count
CREATE OR REPLACE FUNCTION get_product_types_with_count()
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    description TEXT,
    image_url VARCHAR(255),
    product_count BIGINT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pt.id,
        pt.name,
        pt.description,
        pt.image_url,
        COUNT(p.id)::BIGINT as product_count,
        pt.created_at,
        pt.updated_at
    FROM product_types pt
    LEFT JOIN products p ON p.product_type_id = pt.id
    GROUP BY pt.id, pt.name, pt.description, pt.image_url, pt.created_at, pt.updated_at
    ORDER BY pt.name;
END;
$$ LANGUAGE plpgsql;

-- Function to safely delete a product type (checks for existing products)
CREATE OR REPLACE FUNCTION safe_delete_product_type(type_id UUID)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT
) AS $$
DECLARE
    product_count INTEGER;
BEGIN
    -- Check if there are any products of this type
    SELECT COUNT(*) INTO product_count
    FROM products
    WHERE product_type_id = type_id;
    
    IF product_count > 0 THEN
        RETURN QUERY SELECT false, 'Cannot delete: Product type has ' || product_count || ' products associated with it';
    ELSE
        DELETE FROM product_types WHERE id = type_id;
        RETURN QUERY SELECT true, 'Product type deleted successfully';
    END IF;
END;
$$ LANGUAGE plpgsql;
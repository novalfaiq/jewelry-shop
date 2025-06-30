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

-- Enable RLS for product_types
ALTER TABLE product_types ENABLE ROW LEVEL SECURITY;

-- Create policies for product_types
CREATE POLICY "Allow public read access" ON product_types
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert access" ON product_types
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update access" ON product_types
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete access" ON product_types
  FOR DELETE
  USING (auth.role() = 'authenticated');

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

-- Contact Messages Table
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  category VARCHAR(50) NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'product', 'service', 'support', 'feedback', 'other')),
  assigned_to UUID REFERENCES auth.users(id),
  phone VARCHAR(50),
  company VARCHAR(255),
  source VARCHAR(50) DEFAULT 'web' CHECK (source IN ('web', 'email', 'phone', 'social')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  replied_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Contact Message Replies Table
CREATE TABLE contact_message_replies (
  id SERIAL PRIMARY KEY,
  message_id INTEGER NOT NULL REFERENCES contact_messages(id) ON DELETE CASCADE,
  replied_by UUID NOT NULL REFERENCES auth.users(id),
  reply_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Message Tags Table
CREATE TABLE contact_message_tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  color VARCHAR(20) NOT NULL DEFAULT 'blue',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Messages to Tags Junction Table
CREATE TABLE contact_messages_to_tags (
  message_id INTEGER REFERENCES contact_messages(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES contact_message_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (message_id, tag_id)
);

-- Contact Message Attachments Table
CREATE TABLE contact_message_attachments (
  id SERIAL PRIMARY KEY,
  message_id INTEGER NOT NULL REFERENCES contact_messages(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for all contact-related tables
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_message_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_message_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages_to_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_message_attachments ENABLE ROW LEVEL SECURITY;

-- Create policies for contact_messages
CREATE POLICY "Allow authenticated read access to contact_messages" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public insert access to contact_messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update access to contact_messages" ON contact_messages
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create policies for contact_message_replies
CREATE POLICY "Allow authenticated access to contact_message_replies" ON contact_message_replies
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for contact_message_tags
CREATE POLICY "Allow authenticated access to contact_message_tags" ON contact_message_tags
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for contact_messages_to_tags
CREATE POLICY "Allow authenticated access to contact_messages_to_tags" ON contact_messages_to_tags
  FOR ALL USING (auth.role() = 'authenticated');

-- Create policies for contact_message_attachments
CREATE POLICY "Allow authenticated access to contact_message_attachments" ON contact_message_attachments
  FOR ALL USING (auth.role() = 'authenticated');

-- Create trigger for updated_at on contact_messages
CREATE TRIGGER update_contact_messages_modtime
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Create indexes for contact-related tables
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_priority ON contact_messages(priority);
CREATE INDEX idx_contact_messages_category ON contact_messages(category);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX idx_contact_messages_assigned_to ON contact_messages(assigned_to);
CREATE INDEX idx_contact_message_replies_message_id ON contact_message_replies(message_id);
CREATE INDEX idx_contact_message_attachments_message_id ON contact_message_attachments(message_id);

-- Create a view for contact message details with replies count
CREATE OR REPLACE VIEW contact_message_details AS
SELECT 
  cm.*,
  COUNT(DISTINCT cmr.id) as reply_count,
  COUNT(DISTINCT cma.id) as attachment_count,
  STRING_AGG(DISTINCT cmt.name, ', ') as tags
FROM contact_messages cm
LEFT JOIN contact_message_replies cmr ON cm.id = cmr.message_id
LEFT JOIN contact_message_attachments cma ON cm.id = cma.message_id
LEFT JOIN contact_messages_to_tags cmtt ON cm.id = cmtt.message_id
LEFT JOIN contact_message_tags cmt ON cmtt.tag_id = cmt.id
GROUP BY cm.id;

-- Insert some default tags
INSERT INTO contact_message_tags (name, color) VALUES
  ('urgent', 'red'),
  ('follow-up', 'yellow'),
  ('resolved', 'green'),
  ('product-inquiry', 'blue'),
  ('feedback', 'purple')
ON CONFLICT DO NOTHING;

-- Storage bucket for contact attachments
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('contact-attachments', 'contact-attachments', false)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Create policies for contact attachments storage
CREATE POLICY "Allow authenticated access to contact-attachments bucket" ON storage.objects
FOR ALL USING (
  bucket_id = 'contact-attachments' 
  AND auth.role() = 'authenticated'
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
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('product-type-images', 'product-type-images', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Enable RLS for storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for product type images storage
CREATE POLICY "Give users authenticated access to product-type-images bucket" ON storage.objects
FOR ALL USING (
  bucket_id = 'product-type-images' 
  AND auth.role() = 'authenticated'
);

-- Allow public read access to product-type-images
CREATE POLICY "Give public read-only access to product-type-images bucket" ON storage.objects
FOR SELECT USING (
  bucket_id = 'product-type-images'
);

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

-- Reviews Table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for reviews
CREATE POLICY "Allow public read access to approved reviews" ON reviews
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Allow public insert access to reviews" ON reviews
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated full access to reviews" ON reviews
  FOR ALL USING (auth.role() = 'authenticated');

-- Create trigger for updated_at on reviews
CREATE TRIGGER update_reviews_modtime
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Create indexes for reviews
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Heading from '@/components/atoms/Heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminSidebar from '@/components/molecules/AdminSidebar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type ProductType = {
  id: string;
  name: string;
  description: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  product_type_id: string;
  image_url: string | null;
  created_at: string;
  product_type?: ProductType;
};

export default function ProductManagement() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    product_type_id: '',
    image: null as File | null
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editImage, setEditImage] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        router.push('/admin/login');
        return;
      }
      
      setUser(data.session.user);
      setLoading(false);
    };
    
    checkUser();
  }, [router]);
  
  useEffect(() => {
    if (!loading) {
      fetchProductTypes();
      fetchProducts();
    }
  }, [loading]);
  
  const fetchProductTypes = async () => {
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('product_types')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Fetch product types error:', error);
        return;
      }
      
      // Add a dummy record for testing if no data exists
      const dummyRecord = {
        id: 'dummy-id-' + Date.now(),
        name: 'Sample Product Type',
        description: 'This is a sample product type description'
      };
      
      const realData = (data && Array.isArray(data)) ? data : [];
      const finalData = realData.length > 0 ? realData : [dummyRecord];
      
      setProductTypes(finalData);
      
      // Set default product type if none selected
      if (finalData.length > 0 && !newProduct.product_type_id) {
        setNewProduct(prev => ({
          ...prev,
          product_type_id: finalData[0].id
        }));
      }
    } catch (error: any) {
      console.error('Unexpected error fetching product types:', error);
    }
  };
  
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_type:product_types(*)
        `)
        .order('name');
      
      if (error) {
        console.error('Fetch products error:', error);
        setError(`Fetch error: ${error.message}`);
      }
      
      // Add a dummy record for testing if no data exists
      const dummyRecord = {
        id: 'dummy-id-' + Date.now(),
        name: 'Sample Product',
        description: 'This is a sample product description',
        price: 99.99,
        product_type_id: productTypes.length > 0 ? productTypes[0].id : 'no-type',
        image_url: '/blue-ring.png',
        created_at: new Date().toISOString(),
        product_type: productTypes.length > 0 ? productTypes[0] : {
          id: 'no-type',
          name: 'No Type',
          description: 'No product type available'
        }
      };
      
      const realData = (data && Array.isArray(data)) ? data : [];
      const finalData = realData.length > 0 ? realData : [dummyRecord];
      
      setProducts(finalData);
    } catch (error: any) {
      console.error('Unexpected error fetching products:', error);
      setError(`Unexpected error: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  };
  
  const uploadImage = async (file: File) => {
    try {
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.product_type_id) return;
    
    try {
      let imageUrl = '/blue-ring.png'; // Default image
      if (newProduct.image) {
        imageUrl = await uploadImage(newProduct.image);
      }

      const supabase = createClient();
      const { error } = await supabase
        .from('products')
        .insert([{ 
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price) || 0,
          product_type_id: newProduct.product_type_id,
          image_url: imageUrl
        }]);
        
      if (error) throw error;
      setNewProduct({
        name: '',
        description: '',
        price: '',
        product_type_id: productTypes.length > 0 ? productTypes[0].id : '',
        image: null
      });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };
  
  const handleDeleteProduct = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      let imageUrl = editingProduct.image_url;
      if (editImage) {
        imageUrl = await uploadImage(editImage);
      }

      const supabase = createClient();
      const { error } = await supabase
        .from('products')
        .update({ 
          name: editingProduct.name,
          description: editingProduct.description,
          price: editingProduct.price,
          product_type_id: editingProduct.product_type_id,
          image_url: imageUrl
        })
        .eq('id', editingProduct.id);

      if (error) throw error;
      setIsEditModalOpen(false);
      setEditingProduct(null);
      setEditImage(null);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <AdminSidebar onSignOut={handleSignOut} />
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="mb-8">
            <Heading level={2} className="text-blue-900">
              Products Management
            </Heading>
            <p className="text-gray-600">
              Welcome, {user?.email}
            </p>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Product Name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <Input
                      id="description"
                      type="text"
                      placeholder="Description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="product-type" className="block text-sm font-medium text-gray-700">Product Type</label>
                    <Select
                      value={newProduct.product_type_id}
                      onValueChange={(value) => setNewProduct({ ...newProduct, product_type_id: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select Product Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {productTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setNewProduct({ ...newProduct, image: file });
                      }}
                      className="mt-1"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Add Product
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Products List</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p>Loading products...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
                        <div className="flex items-center space-x-4">
                          <img
                            src={product.image_url || '/blue-ring.png'}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.description}</p>
                            <p className="text-sm text-gray-500">Price: ${product.price}</p>
                            <p className="text-sm text-gray-500">Type: {product.product_type?.name}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleEditClick(product)}
                            variant="outline"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDeleteProduct(product.id)}
                            variant="destructive"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Name</label>
                  <Input
                    id="edit-name"
                    type="text"
                    value={editingProduct?.name || ''}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Description</label>
                  <Input
                    id="edit-description"
                    type="text"
                    value={editingProduct?.description || ''}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, description: e.target.value } : null)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">Price</label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={editingProduct?.price || ''}
                    onChange={(e) => setEditingProduct(prev => prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : null)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="edit-product-type" className="block text-sm font-medium text-gray-700">Product Type</label>
                  <Select
                    value={editingProduct?.product_type_id || ''}
                    onValueChange={(value) => setEditingProduct(prev => prev ? { ...prev, product_type_id: value } : null)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select Product Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {productTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="edit-image" className="block text-sm font-medium text-gray-700">Image</label>
                  {editingProduct?.image_url && (
                    <img
                      src={editingProduct.image_url}
                      alt={editingProduct.name}
                      className="w-20 h-20 object-cover rounded mt-1 mb-2"
                    />
                  )}
                  <Input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setEditImage(file);
                    }}
                    className="mt-1"
                  />
                </div>

                <DialogFooter>
                  <Button type="submit">
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
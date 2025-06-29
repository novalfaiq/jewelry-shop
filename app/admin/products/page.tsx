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
  image_url: string;
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
    image_url: ''
  });
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
  
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.product_type_id) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('products')
        .insert([{ 
          name: newProduct.name,
          description: newProduct.description,
          price: parseFloat(newProduct.price) || 0,
          product_type_id: newProduct.product_type_id,
          image_url: newProduct.image_url || '/blue-ring.png'
        }]);
        
      if (error) throw error;
      setNewProduct({
        name: '',
        description: '',
        price: '',
        product_type_id: productTypes.length > 0 ? productTypes[0].id : '',
        image_url: ''
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Product Name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        required
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="99.99"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="product_type" className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                    <Select value={newProduct.product_type_id} onValueChange={(value) => setNewProduct({...newProduct, product_type_id: value})}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a product type" />
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
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <Input
                      id="description"
                      type="text"
                      placeholder="Product Description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">Image URL</label>
                    <Input
                      id="image_url"
                      type="text"
                      placeholder="/path/to/image.png"
                      value={newProduct.image_url}
                      onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  
                  <Button type="submit">Add Product</Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Products List</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
                    <p><strong>Error:</strong> {error}</p>
                  </div>
                )}
                
                {isLoading ? (
                  <p>Loading products...</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.length > 0 ? (
                      products.map((product) => (
                        <div key={product.id} className="p-4 border rounded-lg">
                          <div className="space-y-2">
                            <div className="aspect-square bg-gray-100 rounded-md overflow-hidden relative">
                              {product.image_url && (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                  [Image: {product.image_url}]
                                </div>
                              )}
                            </div>
                            <h3 className="font-medium text-lg">{product.name}</h3>
                            <p className="text-sm text-gray-600">{product.description}</p>
                            <p className="font-bold text-blue-900">${product.price.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">
                              Type: {product.product_type?.name || 'Unknown'}
                            </p>
                            <div className="pt-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => product.id && handleDeleteProduct(product.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full">
                        <p>No products found</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
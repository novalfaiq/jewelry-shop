'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Heading from '@/components/atoms/Heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AdminSidebar from '@/components/molecules/AdminSidebar';
import { prisma } from '@/lib/prisma';

type ProductType = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function ProductTypeManagement() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newProductType, setNewProductType] = useState({ name: '', description: '', image: null as File | null });
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
    }
  }, [loading]);
  
  const fetchProductTypes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/product-types');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch product types');
      }
      
      setProductTypes(data);
    } catch (error: any) {
      console.error('Unexpected error:', error);
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
  
  const handleAddProductType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductType.name) return;
    
    try {
      const supabase = createClient();
      let imageUrl = null;
      
      // Upload image if one is selected
      if (newProductType.image) {
        const fileExt = newProductType.image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-type-images')
          .upload(fileName, newProductType.image);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-type-images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
      }
      
      const response = await fetch('/api/product-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newProductType.name,
          description: newProductType.description,
          imageUrl: imageUrl,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create product type');
      }
      
      setNewProductType({ name: '', description: '', image: null });
      fetchProductTypes();
    } catch (error: any) {
      console.error('Error adding product type:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };
  
  const handleDeleteProductType = async (id: string) => {
    try {
      const response = await fetch(`/api/product-types/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete product type');
      }

      fetchProductTypes();
    } catch (error: any) {
      console.error('Error deleting product type:', error);
      setError(`Error deleting: ${error?.message || 'Unknown error'}`);
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
              Product Types Management
            </Heading>
            <p className="text-gray-600">
              Welcome, {user?.email}
            </p>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Product Type</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddProductType} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Product Type Name"
                      value={newProductType.name}
                      onChange={(e) => setNewProductType({...newProductType, name: e.target.value})}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <Input
                      id="description"
                      type="text"
                      placeholder="Product Type Description"
                      value={newProductType.description}
                      onChange={(e) => setNewProductType({...newProductType, description: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewProductType({...newProductType, image: e.target.files?.[0] || null})}
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit">Add Product Type</Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Product Types List</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
                    <p><strong>Error:</strong> {error}</p>
                  </div>
                )}
                
                {isLoading ? (
                  <p>Loading product types...</p>
                ) : (
                  <div className="space-y-4">
                    {productTypes.length > 0 ? (
                      productTypes.map((productType) => (
                        <div key={productType.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{productType.name}</h3>
                              <p className="text-sm text-gray-600">{productType.description}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Created: {new Date(productType.createdAt).toLocaleDateString()}
                              </p>
                              {productType.imageUrl && (
                                <div className="mt-2">
                                  <img 
                                    src={productType.imageUrl} 
                                    alt={productType.name}
                                    className="w-24 h-24 object-cover rounded-lg"
                                  />
                                </div>
                              )}
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => productType.id && handleDeleteProductType(productType.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No product types found</p>
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
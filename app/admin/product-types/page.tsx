'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Heading from '@/components/atoms/Heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  created_at: string;
};

export default function ProductTypeManagement() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newProductType, setNewProductType] = useState({
    name: '',
    description: ''
  });
  const [editingProductType, setEditingProductType] = useState<ProductType | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('product_types')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Fetch error:', error);
        setError(`Fetch error: ${error.message}`);
        return;
      }
      
      setProductTypes(data || []);
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
      const { error } = await supabase
        .from('product_types')
        .insert([{ 
          name: newProductType.name,
          description: newProductType.description
        }]);
        
      if (error) throw error;
      setNewProductType({
        name: '',
        description: ''
      });
      fetchProductTypes();
    } catch (error) {
      console.error('Error adding product type:', error);
    }
  };

  const handleEditClick = (type: ProductType) => {
    setEditingProductType(type);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductType || !editingProductType.name) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('product_types')
        .update({ 
          name: editingProductType.name,
          description: editingProductType.description
        })
        .eq('id', editingProductType.id);

      if (error) throw error;
      setIsEditModalOpen(false);
      setEditingProductType(null);
      fetchProductTypes();
    } catch (error) {
      console.error('Error updating product type:', error);
    }
  };
  
  const handleDeleteProductType = async (id: string) => {
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('product_types')
        .delete()
        .eq('id', id);
      
      fetchProductTypes();
    } catch (error) {
      console.error('Error deleting product type:', error);
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {productTypes.length > 0 ? (
                      productTypes.map((type) => (
                        <div key={type.id} className="p-4 border rounded-lg">
                          <div className="space-y-2">
                            <h3 className="font-medium text-lg">{type.name}</h3>
                            <p className="text-sm text-gray-600">{type.description}</p>
                            <div className="pt-2 space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditClick(type)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => type.id && handleDeleteProductType(type.id)}
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
                        <p>No product types found</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Edit Product Type</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 mt-4 text-gray-900">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Name</label>
              <Input
                id="edit-name"
                type="text"
                placeholder="Product Type Name"
                value={editingProductType?.name || ''}
                onChange={(e) => setEditingProductType(prev => prev ? {...prev, name: e.target.value} : null)}
                required
                className="mt-1 text-gray-900"
              />
            </div>
            
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Description</label>
              <Input
                id="edit-description"
                type="text"
                placeholder="Product Type Description"
                value={editingProductType?.description || ''}
                onChange={(e) => setEditingProductType(prev => prev ? {...prev, description: e.target.value} : null)}
                className="mt-1 text-gray-900"
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="text-gray-700 hover:text-gray-900">
                Cancel
              </Button>
              <Button type="submit" className="text-white">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

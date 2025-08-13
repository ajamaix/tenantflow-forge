import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  CreditCard,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { productApi } from '@/services/api';

interface Product {
  id: number;
  name: string;
  description: string;
  url?: string;
  image?: string; // Base64 encoded image
  plans?: any[];
  created_at: string;
  tenant_id: number;
}

const Products: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    url: '',
    image: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productApi.getAll();
      setProducts(response.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await productApi.create({
        name: newProduct.name,
        description: newProduct.description,
        url: newProduct.url,
        image: newProduct.image,
      });
      
      setNewProduct({ name: '', description: '', url: '', image: '' });
      setShowCreateForm(false);
      await loadProducts(); // Reload products

      toast({
        title: "Product created",
        description: `${newProduct.name} has been successfully created.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      setIsLoading(true);
      await productApi.delete(id);
      await loadProducts(); // Reload products
      toast({
        title: "Product deleted",
        description: "Product has been successfully removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const viewPlans = (productId: number) => {
    navigate(`/products/${productId}/plans`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getPlansCount = (product: Product) => {
    return product.plans ? product.plans.length : 0;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="saas-card gradient-subtle">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                Product Management
              </h2>
              <p className="text-muted-foreground">
                Create and manage your product offerings
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Products Management */}
        <Card className="saas-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Products
              </CardTitle>
              <CardDescription>
                Manage your product catalog and pricing
              </CardDescription>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="gradient-primary"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </CardHeader>
          
          <CardContent>
            {/* Create Product Form */}
            {showCreateForm && (
              <div className="mb-6 p-4 border border-border rounded-lg bg-muted/30">
                <h3 className="font-semibold mb-4">Create New Product</h3>
                <form onSubmit={handleCreateProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="product_name">Product Name</Label>
                      <Input
                        id="product_name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="Enter product name"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="product_url">Product URL</Label>
                      <Input
                        id="product_url"
                        type="url"
                        value={newProduct.url}
                        onChange={(e) => setNewProduct({...newProduct, url: e.target.value})}
                        placeholder="https://example.com"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="product_description">Description</Label>
                    <Textarea
                      id="product_description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Describe your product"
                      className="min-h-[80px]"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="product_image">Product Image (Base64)</Label>
                    <Textarea
                      id="product_image"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                      placeholder="data:image/jpeg;base64,... or paste base64 string"
                      className="min-h-[100px]"
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Paste a base64 encoded image or data URL
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" className="gradient-primary" disabled={isLoading}>
                      {isLoading ? 'Creating...' : 'Create Product'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCreateForm(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Loading State */}
            {isLoading && !showCreateForm && (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-muted-foreground mt-2">Loading products...</p>
              </div>
            )}

            {/* Products Grid */}
            {!isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="metric-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.removeAttribute('hidden');
                              }}
                            />
                          ) : null}
                          <div 
                            className={`w-12 h-12 gradient-primary rounded-lg flex items-center justify-center ${product.image ? 'hidden' : ''}`}
                          >
                            <Package className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <Badge variant="default">
                          active
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                        {product.url && (
                          <a 
                            href={product.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline block"
                          >
                            {product.url}
                          </a>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <CreditCard className="w-4 h-4" />
                          <span>{getPlansCount(product)} plans</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(product.created_at)}
                        </span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => viewPlans(product.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Plans
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteProduct(product.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && products.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first product to get started
                </p>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="gradient-primary"
                  disabled={isLoading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Product
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Products;
import React, { useState } from 'react';
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

interface Product {
  id: number;
  name: string;
  description: string;
  plans_count: number;
  created_at: string;
  status: 'active' | 'draft';
}

const Products: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: ''
  });

  // Mock data - replace with API calls
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: 'SaaS Platform Basic',
      description: 'Essential features for small teams and startups',
      plans_count: 3,
      created_at: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'SaaS Platform Pro',
      description: 'Advanced features for growing businesses',
      plans_count: 4,
      created_at: '2024-02-20',
      status: 'active'
    },
    {
      id: 3,
      name: 'SaaS Platform Enterprise',
      description: 'Complete solution for large organizations',
      plans_count: 2,
      created_at: '2024-03-10',
      status: 'draft'
    }
  ]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock API call
    const mockProduct: Product = {
      id: products.length + 1,
      ...newProduct,
      plans_count: 0,
      created_at: new Date().toISOString().split('T')[0],
      status: 'draft'
    };

    setProducts([...products, mockProduct]);
    setNewProduct({ name: '', description: '' });
    setShowCreateForm(false);

    toast({
      title: "Product created",
      description: `${newProduct.name} has been successfully created.`,
    });
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: "Product deleted",
      description: "Product has been successfully removed.",
    });
  };

  const viewPlans = (productId: number) => {
    navigate(`/products/${productId}/plans`);
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
                      />
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
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" className="gradient-primary">
                      Create Product
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="metric-card">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                        {product.status}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <CreditCard className="w-4 h-4" />
                        <span>{product.plans_count} plans</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {product.created_at}
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
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first product to get started
                </p>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="gradient-primary"
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
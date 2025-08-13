import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  DollarSign, 
  Users, 
  Settings, 
  ArrowLeft,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { planApi, productApi } from '@/services/api';

interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
  active: boolean;
  product_id: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
}

const ProductPlans: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { tenant } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    price: '',
    features: ''
  });

  useEffect(() => {
    if (productId) {
      fetchProductAndPlans();
    }
  }, [productId]);

  const fetchProductAndPlans = async () => {
    try {
      setLoading(true);
      const [productResponse, plansResponse] = await Promise.all([
        productApi.getById(parseInt(productId!)),
        planApi.getByProduct(parseInt(productId!))
      ]);
      
      setProduct(productResponse.data);
      setPlans(plansResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load product plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const featuresArray = newPlan.features.split('\n').filter(f => f.trim());
      
      await planApi.create(parseInt(productId!), {
        name: newPlan.name,
        description: newPlan.description,
        price: parseFloat(newPlan.price),
        currency: 'USD',
        interval: 'month',
        features: featuresArray.reduce((acc, feature, index) => {
          acc[`feature_${index + 1}`] = feature;
          return acc;
        }, {} as Record<string, any>)
      });

      setNewPlan({ name: '', description: '', price: '', features: '' });
      setShowCreateForm(false);
      await fetchProductAndPlans();

      toast({
        title: "Plan created",
        description: `${newPlan.name} has been successfully created.`,
      });
    } catch (error) {
      console.error('Error creating plan:', error);
      toast({
        title: "Error",
        description: "Failed to create plan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async (planId: number) => {
    try {
      setLoading(true);
      await planApi.delete(planId);
      await fetchProductAndPlans();
      
      toast({
        title: "Plan deleted",
        description: "Plan has been successfully removed.",
      });
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({
        title: "Error",
        description: "Failed to delete plan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !product) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/products')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                {product?.name} - Pricing Plans
              </h1>
              <p className="text-muted-foreground">
                Manage pricing strategies for {product?.name}
              </p>
            </div>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)} 
            className="gradient-primary"
            disabled={loading}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        </div>

        {/* Create Plan Form */}
        {showCreateForm && (
          <Card className="saas-card">
            <CardHeader>
              <CardTitle>Create New Plan</CardTitle>
              <CardDescription>
                Add a new pricing plan for {product?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePlan} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plan_name">Plan Name</Label>
                    <Input
                      id="plan_name"
                      value={newPlan.name}
                      onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                      placeholder="e.g., Basic Plan"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="plan_price">Price (USD)</Label>
                    <Input
                      id="plan_price"
                      type="number"
                      step="0.01"
                      value={newPlan.price}
                      onChange={(e) => setNewPlan({...newPlan, price: e.target.value})}
                      placeholder="29.99"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="plan_description">Description</Label>
                  <Textarea
                    id="plan_description"
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                    placeholder="Describe this plan"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="plan_features">Features (one per line)</Label>
                  <Textarea
                    id="plan_features"
                    value={newPlan.features}
                    onChange={(e) => setNewPlan({...newPlan, features: e.target.value})}
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                    className="min-h-[100px]"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="gradient-primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Plan'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateForm(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.length > 0 ? (
            plans.map((plan) => (
              <Card key={plan.id} className="saas-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      {plan.name}
                    </CardTitle>
                    <Badge variant={plan.active ? "default" : "secondary"}>
                      {plan.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-2xl font-bold">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground">/month</span>
                  </div>
                  <div className="space-y-2">
                    {plan.features?.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => deletePlan(plan.id)}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="saas-card text-center py-12">
                <CardContent>
                  <DollarSign className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Plans Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first pricing plan for {product?.name}
                  </p>
                  <Button onClick={() => setShowCreateForm(true)} className="gradient-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductPlans;
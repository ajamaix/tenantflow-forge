import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { planApi, productApi } from '@/services/api';
import { Package, Plus, Edit, Trash2, ArrowLeft, DollarSign, Users, Calendar, ChevronDown, ChevronUp, ShoppingCart, CreditCard } from 'lucide-react';
import PurchaseDialog from '@/components/PurchaseDialog';
import PurchasedPlansDialog from '@/components/PurchasedPlansDialog';

interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  features: Record<string, any>;
  product_id: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  url?: string;
  image?: string;
}

const ProductPlans: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [expandedFeatures, setExpandedFeatures] = useState<{ [key: number]: boolean }>({});
  const [purchaseDialogPlan, setPurchaseDialogPlan] = useState<Plan | null>(null);
  const [showPurchasedPlans, setShowPurchasedPlans] = useState(false);
  const [purchasedPlans, setPurchasedPlans] = useState<any[]>([]);
  
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'usd',
    interval: 'month',
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

  const fetchPlans = async () => {
    try {
      const response = await planApi.getByProduct(parseInt(productId!));
      setPlans(response.data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const createPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const featuresArray = newPlan.features.split('\n').filter(f => f.trim());
      
      await planApi.create(parseInt(productId!), {
        name: newPlan.name,
        description: newPlan.description,
        price: parseFloat(newPlan.price),
        currency: newPlan.currency,
        interval: newPlan.interval,
        features: featuresArray.reduce((acc, feature, index) => {
          acc[`feature_${index + 1}`] = feature;
          return acc;
        }, {} as Record<string, any>)
      });

      setNewPlan({ name: '', description: '', price: '', currency: 'usd', interval: 'month', features: '' });
      setShowCreateForm(false);
      await fetchPlans();

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

  const editPlan = (plan: Plan) => {
    setEditingPlan(plan);
  };

  const updatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    try {
      setLoading(true);
      const featuresString = typeof editingPlan.features === 'string' ? editingPlan.features : Object.values(editingPlan.features || {}).join('\n');
      const featuresArray = featuresString.split('\n').filter(f => f.trim());
      
      await planApi.update(editingPlan.id, {
        name: editingPlan.name,
        description: editingPlan.description,
        price: editingPlan.price,
        currency: editingPlan.currency,
        interval: editingPlan.interval,
        features: featuresArray.reduce((acc, feature, index) => {
          acc[`feature_${index + 1}`] = feature;
          return acc;
        }, {} as Record<string, any>)
      });

      setEditingPlan(null);
      await fetchPlans();

      toast({
        title: "Plan updated",
        description: "Plan has been successfully updated",
      });
    } catch (error) {
      console.error('Error updating plan:', error);
      toast({
        title: "Error",
        description: "Failed to update plan",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async (planId: number) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      await planApi.delete(planId);
      toast({
        title: "Plan deleted",
        description: "Plan has been successfully deleted",
      });
      fetchPlans();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete plan",
        variant: "destructive",
      });
    }
  };

  const handlePurchaseComplete = (planId: number, transactionId: string) => {
    const purchasedPlan = plans.find(p => p.id === planId);
    if (purchasedPlan) {
      const newPurchase = {
        id: Date.now(),
        planId,
        planName: purchasedPlan.name,
        planDescription: purchasedPlan.description,
        price: purchasedPlan.price,
        currency: purchasedPlan.currency,
        interval: purchasedPlan.interval,
        features: purchasedPlan.features,
        transactionId,
        purchasedAt: new Date().toISOString(),
        status: 'active' as const
      };
      
      setPurchasedPlans(prev => [...prev, newPurchase]);
      setPurchaseDialogPlan(null);
    }
  };

  const toggleFeatureExpansion = (planId: number) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
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
        <div className="saas-card gradient-subtle">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/products')}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-primary mb-2">
                  {product?.name} - Pricing Plans
                </h2>
                <p className="text-muted-foreground">
                  Manage pricing strategies for {product?.name}
                </p>
              </div>
            </div>
            <div className="hidden md:flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowPurchasedPlans(true)}
                className="flex items-center"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                My Purchases ({purchasedPlans.length})
              </Button>
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Plans Management */}
        <Card className="saas-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Pricing Plans
              </CardTitle>
              <CardDescription>
                Create and manage pricing plans for {product?.name}
              </CardDescription>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)} 
              className="gradient-primary"
              disabled={loading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Plan
            </Button>
          </CardHeader>
          <CardContent>
            {/* Create Plan Form */}
            {showCreateForm && (
              <div className="mb-6 p-6 border rounded-lg space-y-4">
                <h3 className="text-lg font-semibold">Create New Plan</h3>
                <form onSubmit={createPlan} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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
                      <Label htmlFor="plan_interval">Billing Interval</Label>
                      <Select 
                        value={newPlan.interval} 
                        onValueChange={(value) => setNewPlan({...newPlan, interval: value})}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="month">Monthly</SelectItem>
                          <SelectItem value="year">Yearly</SelectItem>
                          <SelectItem value="week">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="plan_currency">Currency</Label>
                      <Select 
                        value={newPlan.currency} 
                        onValueChange={(value) => setNewPlan({...newPlan, currency: value})}
                        disabled={loading}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="inr">INR (₹)</SelectItem>
                        </SelectContent>
                      </Select>
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
                      className="min-h-[100px] whitespace-pre-wrap"
                      required
                      disabled={loading}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.shiftKey) {
                          e.preventDefault();
                          const textarea = e.target as HTMLTextAreaElement;
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const value = textarea.value;
                          const newValue = value.substring(0, start) + '\n' + value.substring(end);
                          setNewPlan({...newPlan, features: newValue});
                          setTimeout(() => {
                            textarea.selectionStart = textarea.selectionEnd = start + 1;
                          }, 0);
                        }
                      }}
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
              </div>
            )}

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.length > 0 ? (
                plans.map((plan) => {
                  const features = Object.values(plan.features || {});
                  const isExpanded = expandedFeatures[plan.id];
                  const displayedFeatures = isExpanded ? features : features.slice(0, 3);
                  
                  return (
                    <Card key={plan.id} className="relative">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{plan.name}</CardTitle>
                          <Badge variant="secondary">
                            ${plan.price}/{plan.interval}
                          </Badge>
                        </div>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-2xl font-bold">
                          ${plan.price}
                          <span className="text-sm font-normal text-muted-foreground">
                            /{plan.interval}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-medium">Features:</h4>
                          {displayedFeatures.map((feature, index) => (
                            <div key={index} className="flex items-center text-sm">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></div>
                              <span>{feature}</span>
                            </div>
                          ))}
                          
                          {features.length > 3 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleFeatureExpansion(plan.id)}
                              className="text-xs p-0 h-auto text-primary"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-3 h-3 mr-1" />
                                  Show less
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-3 h-3 mr-1" />
                                  Show {features.length - 3} more
                                </>
                              )}
                            </Button>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="gradient-primary"
                            onClick={() => setPurchaseDialogPlan(plan)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Buy Now
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => editPlan(plan)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deletePlan(plan.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-8">
                  <DollarSign className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Plans Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first pricing plan for {product?.name}
                  </p>
                  <Button onClick={() => setShowCreateForm(true)} className="gradient-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Plan
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Plan Dialog */}
        {editingPlan && (
          <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Plan</DialogTitle>
              </DialogHeader>
              <form onSubmit={updatePlan} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_plan_name">Plan Name</Label>
                    <Input
                      id="edit_plan_name"
                      value={editingPlan.name}
                      onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit_plan_interval">Billing Interval</Label>
                    <Select 
                      value={editingPlan.interval} 
                      onValueChange={(value) => setEditingPlan({...editingPlan, interval: value})}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Monthly</SelectItem>
                        <SelectItem value="year">Yearly</SelectItem>
                        <SelectItem value="week">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit_plan_currency">Currency</Label>
                    <Select 
                      value={editingPlan.currency} 
                      onValueChange={(value) => setEditingPlan({...editingPlan, currency: value})}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                        <SelectItem value="inr">INR (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit_plan_price">Price</Label>
                    <Input
                      id="edit_plan_price"
                      type="number"
                      step="0.01"
                      value={editingPlan.price}
                      onChange={(e) => setEditingPlan({...editingPlan, price: parseFloat(e.target.value)})}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit_plan_description">Description</Label>
                  <Textarea
                    id="edit_plan_description"
                    value={editingPlan.description}
                    onChange={(e) => setEditingPlan({...editingPlan, description: e.target.value})}
                    required
                    disabled={loading}
                    className="whitespace-pre-wrap"
                  />
                </div>
                <div>
                  <Label htmlFor="edit_plan_features">Features (one per line)</Label>
                  <Textarea
                    id="edit_plan_features"
                    value={typeof editingPlan.features === 'string' ? editingPlan.features : Object.values(editingPlan.features || {}).join('\n')}
                    onChange={(e) => {
                      const featuresString = e.target.value;
                      setEditingPlan({...editingPlan, features: featuresString.split('\n').reduce((acc, feature, index) => {
                        if (feature.trim()) acc[`feature_${index + 1}`] = feature.trim();
                        return acc;
                      }, {} as Record<string, any>)});
                    }}
                    className="min-h-[100px] whitespace-pre-wrap"
                    required
                    disabled={loading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.shiftKey) {
                        e.preventDefault();
                        const textarea = e.target as HTMLTextAreaElement;
                        const start = textarea.selectionStart;
                        const end = textarea.selectionEnd;
                        const value = textarea.value;
                        const newValue = value.substring(0, start) + '\n' + value.substring(end);
                        const currentFeatures = typeof editingPlan.features === 'string' ? editingPlan.features : Object.values(editingPlan.features || {}).join('\n');
                        const newFeaturesObj = newValue.split('\n').reduce((acc, feature, index) => {
                          if (feature.trim()) acc[`feature_${index + 1}`] = feature.trim();
                          return acc;
                        }, {} as Record<string, any>);
                        setEditingPlan({...editingPlan, features: newFeaturesObj});
                        setTimeout(() => {
                          textarea.selectionStart = textarea.selectionEnd = start + 1;
                        }, 0);
                      }
                    }}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="gradient-primary" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Plan'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setEditingPlan(null)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Purchase Dialog */}
        <PurchaseDialog
          plan={purchaseDialogPlan}
          open={!!purchaseDialogPlan}
          onOpenChange={(open) => !open && setPurchaseDialogPlan(null)}
          onPurchaseComplete={handlePurchaseComplete}
        />

        {/* Purchased Plans Dialog */}
        <PurchasedPlansDialog
          open={showPurchasedPlans}
          onOpenChange={setShowPurchasedPlans}
          purchasedPlans={purchasedPlans}
        />
      </div>
    </DashboardLayout>
  );
};

export default ProductPlans;
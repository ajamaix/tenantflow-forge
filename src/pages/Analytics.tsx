import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Activity,
  Package,
  CreditCard
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { productApi, planApi } from '@/services/api';

const Analytics: React.FC = () => {
  const { tenant } = useAuth();
  const [products, setProducts] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [productsResponse, plansResponse] = await Promise.all([
        productApi.getAll(),
        planApi.getAll()
      ]);
      setProducts(productsResponse.data || []);
      setPlans(plansResponse.data || []);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = plans.reduce((sum: number, plan: any) => sum + (plan.price || 0), 0);
  const activeProducts = products.length;
  const activePlans = plans.filter((plan: any) => plan.active).length;

  const analyticsData = [
    {
      title: 'Total Products',
      value: activeProducts.toString(),
      change: products.length > 0 ? `${products.length} total` : 'No products',
      trend: 'up',
      icon: Package,
      description: 'in catalog'
    },
    {
      title: 'Active Plans',
      value: activePlans.toString(),
      change: `${plans.length} total plans`,
      trend: 'up',
      icon: CreditCard,
      description: 'pricing options'
    },
    {
      title: 'Plan Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      change: plans.length > 0 ? `${plans.length} plans` : 'No plans',
      trend: 'up',
      icon: DollarSign,
      description: 'potential monthly'
    },
    {
      title: 'Avg Plan Price',
      value: plans.length > 0 ? `$${(totalRevenue / plans.length).toFixed(2)}` : '$0.00',
      change: 'per plan',
      trend: 'up',
      icon: Activity,
      description: 'average pricing'
    }
  ];

  const recentMetrics = [
    { label: 'Page Views', value: '12,543', change: '+5.2%' },
    { label: 'Unique Visitors', value: '3,421', change: '+2.1%' },
    { label: 'Bounce Rate', value: '42.3%', change: '-1.8%' },
    { label: 'Average Session', value: '4m 32s', change: '+12s' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Performance insights for {tenant?.name}
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            Last updated: 2 hours ago
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsData.map((metric, index) => {
            const Icon = metric.icon;
            const isPositive = metric.trend === 'up';
            const TrendIcon = isPositive ? TrendingUp : TrendingDown;
            
            return (
              <Card key={index} className="saas-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {metric.title}
                      </p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <div className="flex items-center mt-1">
                        <TrendIcon 
                          className={`w-4 h-4 mr-1 ${
                            isPositive ? 'text-success' : 'text-destructive'
                          }`} 
                        />
                        <span 
                          className={`text-sm ${
                            isPositive ? 'text-success' : 'text-destructive'
                          }`}
                        >
                          {metric.change}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">
                          {metric.description}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <Card className="saas-card">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>
                Monthly revenue for the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                <div className="text-center">
                  <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Revenue chart would go here</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Engagement */}
          <Card className="saas-card">
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
              <CardDescription>
                Website traffic and user behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{metric.value}</span>
                      <Badge 
                        variant={metric.change.startsWith('+') ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {metric.change}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Plans */}
        <Card className="saas-card">
          <CardHeader>
            <CardTitle>Current Pricing Plans</CardTitle>
            <CardDescription>
              Your active pricing plans across all products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {plans.slice(0, 3).map((plan: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h3 className="font-medium">{plan.name || 'Unnamed Plan'}</h3>
                    <p className="text-sm text-muted-foreground">{plan.description || 'No description'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${plan.price || 0}/month</p>
                    <Badge variant={plan.active ? "default" : "outline"} className="text-xs">
                      {plan.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              ))}
              {plans.length === 0 && (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No plans created yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
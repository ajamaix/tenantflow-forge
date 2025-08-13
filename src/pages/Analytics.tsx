import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Analytics: React.FC = () => {
  const { tenant } = useAuth();

  const analyticsData = [
    {
      title: 'Total Revenue',
      value: '$24,500',
      change: '+12%',
      trend: 'up',
      icon: DollarSign,
      description: 'vs last month'
    },
    {
      title: 'New Customers',
      value: '156',
      change: '+8%',
      trend: 'up',
      icon: Users,
      description: 'this month'
    },
    {
      title: 'Total Orders',
      value: '342',
      change: '-3%',
      trend: 'down',
      icon: ShoppingCart,
      description: 'vs last month'
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+0.5%',
      trend: 'up',
      icon: Activity,
      description: 'vs last month'
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

        {/* Top Performers */}
        <Card className="saas-card">
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>
              Your best selling products this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Premium Plan', sales: 156, revenue: '$15,600' },
                { name: 'Basic Plan', sales: 89, revenue: '$8,900' },
                { name: 'Enterprise Plan', sales: 23, revenue: '$23,000' }
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{product.revenue}</p>
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
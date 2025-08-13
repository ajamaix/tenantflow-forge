import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { analyticsApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { 
  Package, 
  CreditCard, 
  Users, 
  TrendingUp,
  Plus,
  ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, tenant } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [metricsResponse, activityResponse] = await Promise.all([
          analyticsApi.getDashboardMetrics(),
          analyticsApi.getRecentActivity()
        ]);

        const metricsData = metricsResponse.data;
        setMetrics([
          {
            title: 'Total Products',
            value: metricsData.total_products.toString(),
            change: 'Active products',
            icon: Package,
            color: 'text-primary'
          },
          {
            title: 'Active Plans',
            value: metricsData.active_plans.toString(),
            change: 'Available plans',
            icon: CreditCard,
            color: 'text-accent'
          },
          {
            title: 'Team Members',
            value: metricsData.team_members.toString(),
            change: 'Total members',
            icon: Users,
            color: 'text-success'
          },
          {
            title: 'Revenue Growth',
            value: `${metricsData.revenue_growth >= 0 ? '+' : ''}${metricsData.revenue_growth.toFixed(1)}%`,
            change: 'vs last month',
            icon: TrendingUp,
            color: 'text-warning'
          }
        ]);

        setRecentActivity(activityResponse.data || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  const quickActions = [
    {
      title: 'Add New Product',
      description: 'Create a new product offering',
      action: () => navigate('/products'),
      icon: Package,
      color: 'bg-primary-light text-primary'
    },
    {
      title: 'View Analytics',
      description: 'Check your business performance',
      action: () => navigate('/analytics'),
      icon: TrendingUp,
      color: 'bg-accent-light text-accent'
    },
    {
      title: 'Manage Team',
      description: 'View and manage team members',
      action: () => navigate('/team'),
      icon: Users,
      color: 'bg-success-light text-success'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="saas-card gradient-subtle">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                Welcome back, {user?.email?.split('@')[0]}!
              </h2>
              <p className="text-muted-foreground">
                Here's what's happening with {tenant?.name || 'your business'} today.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="metric-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-8 bg-muted rounded mb-1"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                    <div className="w-12 h-12 bg-muted rounded-lg"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : metrics ? (
            metrics.map((metric: any, index: number) => {
              const Icon = metric.icon;
              return (
                <Card key={index} className="metric-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {metric.title}
                        </p>
                        <p className="text-2xl font-bold">{metric.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {metric.change}
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg ${metric.color} bg-opacity-10`}>
                        <Icon className={`w-6 h-6 ${metric.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : null}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="saas-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Get started with common tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <div 
                    key={index}
                    className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-custom cursor-pointer"
                    onClick={action.action}
                  >
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{action.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="saas-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates and changes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                // Loading skeleton
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-muted rounded mb-1"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((activity: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'purchase_made' ? 'bg-primary' :
                        activity.type === 'product_created' ? 'bg-accent' :
                        activity.type === 'plan_created' ? 'bg-success' :
                        'bg-muted-foreground'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  No recent activity
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
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

  const metrics = [
    {
      title: 'Total Products',
      value: '12',
      change: '+2 this month',
      icon: Package,
      color: 'text-primary'
    },
    {
      title: 'Active Plans',
      value: '24',
      change: '+8 this month',
      icon: CreditCard,
      color: 'text-accent'
    },
    {
      title: 'Team Members',
      value: '6',
      change: '+1 this month',
      icon: Users,
      color: 'text-success'
    },
    {
      title: 'Revenue Growth',
      value: '+15%',
      change: 'vs last month',
      icon: TrendingUp,
      color: 'text-warning'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Product',
      description: 'Create a new product offering',
      action: () => navigate('/products/new'),
      icon: Package,
      color: 'bg-primary-light text-primary'
    },
    {
      title: 'Create Pricing Plan',
      description: 'Set up a new pricing strategy',
      action: () => navigate('/plans/new'),
      icon: CreditCard,
      color: 'bg-accent-light text-accent'
    },
    {
      title: 'Invite Team Member',
      description: 'Add someone to your team',
      action: () => navigate('/team/invite'),
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
          {metrics.map((metric, index) => {
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
          })}
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
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New product "Premium Plan" created</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Pricing updated for "Basic Plan"</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Team member invited</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
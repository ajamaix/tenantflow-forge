import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Globe,
  Users,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Tenant {
  id: number;
  tenant_name: string;
  tenant_domain: string;
  tenant_code: string;
  created_at: string;
  user_count: number;
  status: 'active' | 'inactive';
}

const SuperAdmin: React.FC = () => {
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTenant, setNewTenant] = useState({
    tenant_name: '',
    tenant_domain: '',
    tenant_code: ''
  });

  // Mock data - replace with API calls
  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: 1,
      tenant_name: 'Demo Company',
      tenant_domain: 'demo',
      tenant_code: 'DEMO001',
      created_at: '2024-01-15',
      user_count: 12,
      status: 'active'
    },
    {
      id: 2,
      tenant_name: 'Tech Startup',
      tenant_domain: 'techstart',
      tenant_code: 'TECH002',
      created_at: '2024-02-20',
      user_count: 8,
      status: 'active'
    },
    {
      id: 3,
      tenant_name: 'Enterprise Corp',
      tenant_domain: 'enterprise',
      tenant_code: 'ENT003',
      created_at: '2024-03-10',
      user_count: 45,
      status: 'inactive'
    }
  ]);

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock API call
    const mockTenant: Tenant = {
      id: tenants.length + 1,
      ...newTenant,
      created_at: new Date().toISOString().split('T')[0],
      user_count: 0,
      status: 'active'
    };

    setTenants([...tenants, mockTenant]);
    setNewTenant({ tenant_name: '', tenant_domain: '', tenant_code: '' });
    setShowCreateForm(false);

    toast({
      title: "Tenant created",
      description: `${newTenant.tenant_name} has been successfully created.`,
    });
  };

  const deleteTenant = (id: number) => {
    setTenants(tenants.filter(t => t.id !== id));
    toast({
      title: "Tenant deleted",
      description: "Tenant has been successfully removed.",
    });
  };

  const systemStats = [
    {
      title: 'Total Tenants',
      value: tenants.length.toString(),
      change: '+2 this month',
      icon: Building2,
      color: 'text-primary'
    },
    {
      title: 'Active Users',
      value: tenants.reduce((acc, t) => acc + t.user_count, 0).toString(),
      change: '+15 this month',
      icon: Users,
      color: 'text-accent'
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      change: 'Last 30 days',
      icon: Globe,
      color: 'text-success'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* System Overview */}
        <div className="saas-card gradient-subtle">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                System Overview
              </h2>
              <p className="text-muted-foreground">
                Manage tenants and monitor system performance
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {systemStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="metric-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tenant Management */}
        <Card className="saas-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Tenant Management
              </CardTitle>
              <CardDescription>
                Create and manage tenant organizations
              </CardDescription>
            </div>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="gradient-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Tenant
            </Button>
          </CardHeader>
          
          <CardContent>
            {/* Create Tenant Form */}
            {showCreateForm && (
              <div className="mb-6 p-4 border border-border rounded-lg bg-muted/30">
                <h3 className="font-semibold mb-4">Create New Tenant</h3>
                <form onSubmit={handleCreateTenant} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="tenant_name">Tenant Name</Label>
                    <Input
                      id="tenant_name"
                      value={newTenant.tenant_name}
                      onChange={(e) => setNewTenant({...newTenant, tenant_name: e.target.value})}
                      placeholder="Company Name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tenant_domain">Domain</Label>
                    <Input
                      id="tenant_domain"
                      value={newTenant.tenant_domain}
                      onChange={(e) => setNewTenant({...newTenant, tenant_domain: e.target.value})}
                      placeholder="subdomain"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tenant_code">Tenant Code</Label>
                    <Input
                      id="tenant_code"
                      value={newTenant.tenant_code}
                      onChange={(e) => setNewTenant({...newTenant, tenant_code: e.target.value})}
                      placeholder="CODE001"
                      required
                    />
                  </div>
                  <div className="flex space-x-2 md:col-span-3">
                    <Button type="submit" className="gradient-primary">
                      Create Tenant
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

            {/* Tenants List */}
            <div className="space-y-4">
              {tenants.map((tenant) => (
                <div 
                  key={tenant.id} 
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-custom"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{tenant.tenant_name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Globe className="w-4 h-4" />
                        <span>{tenant.tenant_domain}.example.com</span>
                        <span>•</span>
                        <span>{tenant.tenant_code}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{tenant.user_count} users</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{tenant.created_at}</span>
                      </div>
                    </div>
                    
                    <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'}>
                      {tenant.status}
                    </Badge>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => deleteTenant(tenant.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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

export default SuperAdmin;
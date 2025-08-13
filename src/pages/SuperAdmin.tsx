import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
import { Navigate } from 'react-router-dom';
import { tenantApi } from '@/services/api';

interface Tenant {
  id: number;
  tenant_name: string;
  tenant_domain: string;
  tenant_code: string;
  created_at: string;
  users?: any[];
}

const SuperAdmin: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTenant, setNewTenant] = useState({
    tenant_name: '',
    tenant_domain: '',
    tenant_code: ''
  });

  // Redirect if not super admin
  if (!user || user.role !== 'super_admin') {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    try {
      setIsLoading(true);
      const data = await tenantApi.getAll();
      setTenants(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tenants",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      await tenantApi.create({
        tenant_name: newTenant.tenant_name,
        tenant_domain: newTenant.tenant_domain,
        tenant_code: newTenant.tenant_code,
      });
      
      setNewTenant({ tenant_name: '', tenant_domain: '', tenant_code: '' });
      setShowCreateForm(false);
      await loadTenants(); // Reload tenants

      toast({
        title: "Tenant created",
        description: `${newTenant.tenant_name} has been successfully created.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create tenant",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTenant = async (id: number) => {
    try {
      setIsLoading(true);
      await tenantApi.delete(id);
      await loadTenants(); // Reload tenants
      toast({
        title: "Tenant deleted",
        description: "Tenant has been successfully removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete tenant",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getUserCount = (tenant: Tenant) => {
    return tenant.users ? tenant.users.length : 0;
  };

  const systemStats = [
    {
      title: 'Total Tenants',
      value: tenants.length.toString(),
      change: `${tenants.length} active`,
      icon: Building2,
      color: 'text-primary'
    },
    {
      title: 'Total Users',
      value: tenants.reduce((acc, t) => acc + getUserCount(t), 0).toString(),
      change: 'Across all tenants',
      icon: Users,
      color: 'text-accent'
    },
    {
      title: 'System Status',
      value: 'Online',
      change: 'All systems operational',
      icon: Globe,
      color: 'text-success'
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* System Overview */}
        <div className="saas-card gradient-subtle">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                Super Admin Dashboard
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
              disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex space-x-2 md:col-span-3">
                    <Button type="submit" className="gradient-primary" disabled={isLoading}>
                      {isLoading ? 'Creating...' : 'Create Tenant'}
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
                <p className="text-muted-foreground mt-2">Loading tenants...</p>
              </div>
            )}

            {/* Tenants List */}
            {!isLoading && (
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
                          <span>{tenant.tenant_domain}.localhost:3000</span>
                          <span>•</span>
                          <span>{tenant.tenant_code}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right text-sm">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{getUserCount(tenant)} users</span>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(tenant.created_at)}</span>
                        </div>
                      </div>
                      
                      <Badge variant="default">
                        active
                      </Badge>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteTenant(tenant.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isLoading && tenants.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tenants yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first tenant to get started
                </p>
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="gradient-primary"
                  disabled={isLoading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Tenant
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdmin;
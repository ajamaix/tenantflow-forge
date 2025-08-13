import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, DollarSign, Users, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { planApi } from '@/services/api';

interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
  active: boolean;
}

const Plans: React.FC = () => {
  const { tenant } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await planApi.getAll();
      setPlans(response.data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = () => {
    // Navigate to create plan form
    console.log('Create new plan');
  };

  if (loading) {
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
          <div>
            <h1 className="text-3xl font-bold">Pricing Plans</h1>
            <p className="text-muted-foreground">
              Manage your pricing strategies for {tenant?.name}
            </p>
          </div>
          <Button onClick={handleCreatePlan} className="gradient-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Plan
          </Button>
        </div>

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
                      <Settings className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Users className="w-4 h-4 mr-2" />
                      Users
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
                    Create your first pricing plan to get started
                  </p>
                  <Button onClick={handleCreatePlan} className="gradient-primary">
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

export default Plans;
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { purchaseApi } from '@/services/api';
import { CreditCard, Calendar, DollarSign, Package } from 'lucide-react';

interface Purchase {
  id: number;
  plan_id: number;
  transaction_id: string;
  amount: number;
  currency: string;
  status: string;
  purchased_at: string;
  expires_at?: string;
  plan?: {
    id: number;
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: string;
    features: Record<string, any>;
    product?: {
      id: number;
      name: string;
      description: string;
    };
  };
}

const ActivePlans: React.FC = () => {
  const { toast } = useToast();
  const [activePurchases, setActivePurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivePurchases();
  }, []);

  const fetchActivePurchases = async () => {
    try {
      const response = await purchaseApi.getActivePurchases();
      setActivePurchases(response.data || []);
    } catch (error) {
      console.error('Error fetching active purchases:', error);
      toast({
        title: "Error",
        description: "Failed to load active plans",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRemainingDays = (expiresAt?: string) => {
    if (!expiresAt) return null;
    const today = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="saas-card gradient-subtle">
            <h2 className="text-2xl font-bold text-primary mb-2">Active Plans</h2>
            <p className="text-muted-foreground">Your currently active subscriptions</p>
          </div>
          <div className="grid gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="saas-card">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-6 bg-muted rounded w-1/3"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">Active Plans</h2>
              <p className="text-muted-foreground">
                Your currently active subscriptions and purchases
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Active Plans */}
        {activePurchases.length > 0 ? (
          <div className="grid gap-6">
            {activePurchases.map((purchase) => {
              const features = Object.values(purchase.plan?.features || {});
              const remainingDays = getRemainingDays(purchase.expires_at);
              
              return (
                <Card key={purchase.id} className="saas-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <Package className="w-5 h-5 mr-2" />
                          {purchase.plan?.product?.name} - {purchase.plan?.name}
                        </CardTitle>
                        <CardDescription>{purchase.plan?.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge variant={purchase.status === 'active' ? 'default' : 'secondary'}>
                          {purchase.status}
                        </Badge>
                        {remainingDays && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {remainingDays > 0 ? `${remainingDays} days left` : 'Expired'}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Amount Paid</p>
                          <p className="font-medium">${purchase.amount.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Purchased On</p>
                          <p className="font-medium">{formatDate(purchase.purchased_at)}</p>
                        </div>
                      </div>
                      {purchase.expires_at && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Expires On</p>
                            <p className="font-medium">{formatDate(purchase.expires_at)}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {features.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Plan Features:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {features.map((feature, index) => (
                            <div key={index} className="flex items-center text-sm">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0"></div>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground">
                        Transaction ID: {purchase.transaction_id}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="saas-card">
            <CardContent className="text-center py-12">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Active Plans</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any active subscriptions or purchases yet.
              </p>
              <Button 
                onClick={() => window.location.href = '/products'}
                className="gradient-primary"
              >
                Browse Products
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ActivePlans;
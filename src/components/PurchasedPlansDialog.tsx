import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Calendar, CreditCard } from 'lucide-react';

interface PurchasedPlan {
  id: number;
  planId: number;
  planName: string;
  planDescription: string;
  price: number;
  currency: string;
  interval: string;
  features: Record<string, any>;
  transactionId: string;
  purchasedAt: string;
  status: 'active' | 'expired' | 'cancelled';
}

interface PurchasedPlansDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchasedPlans: PurchasedPlan[];
}

const PurchasedPlansDialog: React.FC<PurchasedPlansDialogProps> = ({
  open,
  onOpenChange,
  purchasedPlans
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'expired':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Purchased Plans
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {purchasedPlans.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Purchased Plans</h3>
              <p className="text-muted-foreground">
                You haven't purchased any plans yet. Browse our products to get started!
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {purchasedPlans.map((purchase) => {
                const features = Object.values(purchase.features || {});
                
                return (
                  <Card key={purchase.id} className="border-l-4 border-l-primary">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          <span className="mr-3">{purchase.planName}</span>
                          <Badge 
                            variant="secondary" 
                            className={`${getStatusColor(purchase.status)} text-white`}
                          >
                            {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                          </Badge>
                        </CardTitle>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            ${purchase.price} {purchase.currency.toUpperCase()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            per {purchase.interval}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">{purchase.planDescription}</p>
                        
                        {/* Features */}
                        <div>
                          <h4 className="font-medium mb-2">Features:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                            {features.map((feature, index) => (
                              <div key={index} className="flex items-center text-sm">
                                <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Purchase Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                          <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Purchased: {formatDate(purchase.purchasedAt)}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <CreditCard className="w-4 h-4 mr-2" />
                            <span>Transaction: {purchase.transactionId}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchasedPlansDialog;
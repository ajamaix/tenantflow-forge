import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Smartphone, Check } from 'lucide-react';

interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  features: Record<string, any>;
}

interface PurchaseDialogProps {
  plan: Plan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPurchaseComplete: (planId: number, transactionId: string) => void;
}

const PurchaseDialog: React.FC<PurchaseDialogProps> = ({
  plan,
  open,
  onOpenChange,
  onPurchaseComplete
}) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [loading, setLoading] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const handlePurchase = async () => {
    if (!plan) return;

    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock transaction ID
      const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      onPurchaseComplete(plan.id, transactionId);
      
      toast({
        title: "Payment Successful!",
        description: `You have successfully purchased ${plan.name}`,
      });
      
      onOpenChange(false);
      
      // Reset form
      setUpiId('');
      setCardDetails({ number: '', expiry: '', cvv: '', name: '' });
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    if (paymentMethod === 'upi') {
      return upiId.trim().length > 0;
    } else {
      return cardDetails.number.trim().length > 0 && 
             cardDetails.expiry.trim().length > 0 && 
             cardDetails.cvv.trim().length > 0 && 
             cardDetails.name.trim().length > 0;
    }
  };

  if (!plan) return null;

  const features = Object.values(plan.features || {});

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Purchase Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{plan.name}</span>
                <Badge variant="secondary">
                  ${plan.price}/{plan.interval}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{plan.description}</p>
              <div className="space-y-2">
                <h4 className="font-medium">Features included:</h4>
                <ul className="space-y-1">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="w-4 h-4 text-primary mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Payment Method</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('upi')}
                className="h-16 flex-col"
              >
                <Smartphone className="w-6 h-6 mb-1" />
                UPI Payment
              </Button>
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('card')}
                className="h-16 flex-col"
              >
                <CreditCard className="w-6 h-6 mb-1" />
                Credit/Debit Card
              </Button>
            </div>
          </div>

          {/* Payment Forms */}
          {paymentMethod === 'upi' ? (
            <div className="space-y-4">
              <Label htmlFor="upi_id">UPI ID</Label>
              <Input
                id="upi_id"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                disabled={loading}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="card_name">Cardholder Name</Label>
                <Input
                  id="card_name"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  disabled={loading}
                />
              </div>
              <div>
                <Label htmlFor="card_number">Card Number</Label>
                <Input
                  id="card_number"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  disabled={loading}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="card_expiry">Expiry Date</Label>
                  <Input
                    id="card_expiry"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="card_cvv">CVV</Label>
                  <Input
                    id="card_cvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center text-lg font-medium">
            <span>Total</span>
            <span>${plan.price} {plan.currency.toUpperCase()}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={handlePurchase}
              disabled={!isFormValid() || loading}
              className="flex-1 gradient-primary"
            >
              {loading ? 'Processing...' : `Pay $${plan.price}`}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseDialog;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, MapPin, Package, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrderContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { createOrder, loading } = useOrders();
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const [shippingAddress, setShippingAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const validatePhoneNumber = (phone: string) => {
    // Georgian phone number validation: +995 format or local format
    const georgianPhoneRegex = /^(\+995|995)?[0-9]{9}$/;
    return georgianPhoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      return;
    }

    if (!phoneNumber.trim() || !validatePhoneNumber(phoneNumber)) {
      alert('Please enter a valid phone number');
      return;
    }

    setIsProcessing(true);
    
    try {
      const orderId = await createOrder(
        cartItems,
        shippingAddress,
        useSameAddress ? shippingAddress : billingAddress,
        phoneNumber
      );

      if (orderId) {
        navigate(`/order-success?order=${orderId}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="text-center py-16">
            <CardContent>
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Add some products to your cart before checkout
              </p>
              <Button onClick={() => navigate("/products")}>
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate("/cart")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">Complete your order</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Information */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="shipping">Shipping Address *</Label>
                  <Textarea
                    id="shipping"
                    placeholder="Enter your complete shipping address..."
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+995 XXX XXX XXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Required for delivery coordination
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sameAddress"
                    checked={useSameAddress}
                    onChange={(e) => setUseSameAddress(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="sameAddress">
                    Billing address is the same as shipping address
                  </Label>
                </div>

                {!useSameAddress && (
                  <div>
                    <Label htmlFor="billing">Billing Address *</Label>
                    <Textarea
                      id="billing"
                      placeholder="Enter your billing address..."
                      value={billingAddress}
                      onChange={(e) => setBillingAddress(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-sm">BOG</span>
                    </div>
                    <div>
                      <p className="font-medium">Bank of Georgia Payment Gateway</p>
                      <p className="text-sm text-muted-foreground">
                        Secure payment processing in Georgian Lari (₾)
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 After placing your order, you'll receive payment instructions and can complete the payment through BOG's secure gateway.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium">{item.products.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × ₾{Number(item.products.price).toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium">
                        ₾{(item.quantity * Number(item.products.price)).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₾{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₾{cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                {/* Place Order Button */}
                <Button 
                  className="w-full bg-gradient-hero hover:bg-primary-dark"
                  onClick={handlePlaceOrder}
                  disabled={!shippingAddress.trim() || !phoneNumber.trim() || !validatePhoneNumber(phoneNumber) || isProcessing || loading}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    `Place Order - ₾${cartTotal.toFixed(2)}`
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By placing this order, you agree to our terms and conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
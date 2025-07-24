import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Package, MapPin, CreditCard, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useOrders } from "@/contexts/OrderContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order');
  const { getOrderById } = useOrders();
  const { t } = useLanguage();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        setLoading(true);
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, getOrderById]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Payment Pending';
      case 'paid':
        return 'Payment Confirmed';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="text-center py-16">
            <CardContent>
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Order not found</h2>
              <p className="text-muted-foreground mb-6">
                The order you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link to="/products">Continue Shopping</Link>
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
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We've received your order and will process it shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order Details</span>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order Number</p>
                    <p className="font-medium">#{order.id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-medium">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="font-medium text-lg">₾{Number(order.total_amount).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Method</p>
                    <p className="font-medium">Bank of Georgia</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items.map((item: any) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0 overflow-hidden">
                        {item.products.image_url ? (
                          <img
                            src={item.products.image_url}
                            alt={item.products.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.products.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ₾{Number(item.price).toFixed(2)}
                        </p>
                        <p className="text-sm font-medium">
                          Total: ₾{(item.quantity * Number(item.price)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line">{order.shipping_address}</p>
              </CardContent>
            </Card>
          </div>

          {/* Payment Instructions */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Payment Pending</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Your order has been placed successfully. Please complete the payment to process your order.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Payment Details:</h4>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Order ID:</span>
                      <span className="font-medium">#{order.id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">₾{Number(order.total_amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Currency:</span>
                      <span className="font-medium">GEL</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Next Steps:</h4>
                  <ol className="text-sm space-y-2 list-decimal list-inside">
                    <li>You will receive payment instructions via email shortly</li>
                    <li>Complete the payment through BOG's secure gateway</li>
                    <li>Your order will be processed once payment is confirmed</li>
                    <li>You'll receive tracking information when your order ships</li>
                  </ol>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link to="/products">
                      Continue Shopping
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/orders">View All Orders</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";

export const CartButton = () => {
  const { cartCount } = useCart();
  const { t } = useLanguage();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative transition-all duration-300 hover:scale-105">
          <ShoppingCart className="w-4 h-4 mr-2" />
          {t('header.cart')}
          {cartCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {cartCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-96 sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            Review your items before checkout
          </SheetDescription>
        </SheetHeader>
        <CartContent />
      </SheetContent>
    </Sheet>
  );
};

const CartContent = () => {
  const { cartItems, cartTotal, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center">
        <ShoppingCart className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Your cart is empty</p>
        <p className="text-sm text-muted-foreground">Add some products to get started</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4">
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
          />
        ))}
      </div>

      {/* Cart Summary */}
      <div className="border-t pt-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-lg font-bold">₾{cartTotal.toFixed(2)}</span>
        </div>
        
        <div className="space-y-2">
          <Button className="w-full bg-gradient-hero hover:bg-primary-dark" asChild>
            <Link to="/checkout">Proceed to Checkout</Link>
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={clearCart}
            disabled={loading}
          >
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

interface CartItemProps {
  item: {
    id: string;
    product_id: string;
    quantity: number;
    products: {
      id: string;
      name: string;
      price: number;
      image_url: string | null;
      stock_quantity: number;
    };
  };
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    setIsUpdating(true);
    await onUpdateQuantity(item.product_id, newQuantity);
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    await onRemove(item.product_id);
    setIsUpdating(false);
  };

  return (
    <Card className="p-3">
      <div className="flex gap-3">
        {/* Product Image */}
        <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0 overflow-hidden">
          {item.products.image_url ? (
            <img
              src={item.products.image_url}
              alt={item.products.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{item.products.name}</h4>
          <p className="text-sm text-muted-foreground">₾{Number(item.products.price).toFixed(2)}</p>
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
            >
              <Minus className="w-3 h-3" />
            </Button>
            
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating || item.quantity >= item.products.stock_quantity}
            >
              <Plus className="w-3 h-3" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 ml-2 text-destructive hover:text-destructive"
              onClick={handleRemove}
              disabled={isUpdating}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>

          {/* Stock Warning */}
          {item.products.stock_quantity <= 5 && (
            <p className="text-xs text-orange-600 mt-1">
              Only {item.products.stock_quantity} left in stock
            </p>
          )}
        </div>

        {/* Item Total */}
        <div className="text-right">
          <p className="font-medium">
            ₾{(item.quantity * Number(item.products.price)).toFixed(2)}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CartContent;
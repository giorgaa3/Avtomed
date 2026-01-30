import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Heart, Package, Shield, Truck, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  stock_quantity: number;
  condition: string;
  is_active: boolean;
  manufacturer?: string;
  origin_country?: string;
  categories?: {
    name: string;
  };
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { t } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            categories (
              name
            )
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching product:', error);
          toast.error('Failed to load product');
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const getConditionColor = (condition: string) => {
    return condition === "new" 
      ? "bg-green-100 text-green-800 hover:bg-green-200" 
      : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Button onClick={() => navigate('/products')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/products')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute top-4 left-4">
                <Badge className={getConditionColor(product.condition)}>
                  {product.condition === "new" ? t('products.condition.new') : t('products.condition.refurbished')}
                </Badge>
              </div>
              {(!product.stock_quantity || product.stock_quantity <= 0 || !product.is_active) && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg">Out of Stock</Badge>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.categories?.name || 'Uncategorized'}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-lg text-muted-foreground">{product.description}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : "Out of stock"}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  className="flex-1 bg-gradient-hero hover:scale-105 transition-transform"
                  onClick={() => navigate('/contact')}
                >
                  Contact for Purchase
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Product Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Product Information</h3>
              
              {/* Manufacturer and Origin Info */}
              {(product.manufacturer || product.origin_country) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {product.manufacturer && (
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium text-primary mb-2">Manufacturer</h4>
                        <p className="text-muted-foreground">{product.manufacturer}</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  {product.origin_country && (
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium text-primary mb-2">Made In</h4>
                        <p className="text-muted-foreground">{product.origin_country}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Shield className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">Medical Equipment</p>
                      <p className="text-sm text-muted-foreground">Professional instruments</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Truck className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">Delivery Available</p>
                      <p className="text-sm text-muted-foreground">Contact for details</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Package className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">Product Catalog</p>
                      <p className="text-sm text-muted-foreground">Browse our selection</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <RotateCcw className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">Inquiries Welcome</p>
                      <p className="text-sm text-muted-foreground">Contact us for info</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
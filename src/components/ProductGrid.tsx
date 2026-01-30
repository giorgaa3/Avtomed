import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";


const ProductGrid = () => {
  const { t } = useLanguage();
  
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, []);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new":
        return "bg-medical-green text-white";
      case "refurbished":
        return "bg-medical-blue text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const ProductCard = ({ product }: { product: any }) => {

    return (
      <Card 
        className="group hover:shadow-elegant transition-all duration-300 hover:scale-105 animate-fade-in cursor-pointer"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        <CardContent className="p-4">
          <div className="relative mb-4">
            <img 
              src={product.image_url || "/placeholder.svg"} 
              alt={product.name}
              className="w-full h-80 object-cover rounded-lg"
            />
            <div className="absolute top-2 left-2">
              <Badge className={getConditionColor(product.condition)}>
                {product.condition === "new" ? t('products.condition.new') : t('products.condition.refurbished')}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <Badge variant="outline" className="text-xs">{product.categories?.name || 'Uncategorized'}</Badge>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <div className="flex gap-2 w-full">
            <Button 
              className="flex-1 bg-gradient-hero hover:scale-105 transition-transform" 
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/products/${product.id}`);
              }}
            >
              View Details
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <section className="py-10 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 font-display">{t('products.featured')}</h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            {t('products.description')}
          </p>
        </div>
        
        {loading ? (
          <div className="text-center py-12 md:py-16">
            <div className="animate-spin rounded-full h-16 w-16 md:h-32 md:w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center animate-fade-in">
          <Button size="lg" variant="outline" className="hover:scale-105 transition-transform" asChild>
            <Link to="/products">
              {t('products.viewAll')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
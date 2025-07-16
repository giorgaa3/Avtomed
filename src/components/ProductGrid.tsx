import { Star, Heart, ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const ProductGrid = () => {
  const { t } = useLanguage();

  const products = [
    {
      id: 1,
      name: "Digital Stethoscope Pro",
      price: "$299.99",
      originalPrice: "$399.99",
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 124,
      condition: t('products.condition.new'),
      conditionColor: "bg-medical-green text-white",
      category: "Diagnostic"
    },
    {
      id: 2,
      name: "Surgical Scissors Set",
      price: "$89.99",
      originalPrice: null,
      image: "/placeholder.svg",
      rating: 4.6,
      reviews: 89,
      condition: t('products.condition.new'),
      conditionColor: "bg-medical-green text-white",
      category: "Surgical"
    },
    {
      id: 3,
      name: "Portable Ultrasound",
      price: "$1,299.99",
      originalPrice: "$1,599.99",
      image: "/placeholder.svg",
      rating: 4.9,
      reviews: 67,
      condition: t('products.condition.refurbished'),
      conditionColor: "bg-medical-blue text-white",
      category: "Imaging"
    },
    {
      id: 4,
      name: "Blood Pressure Monitor",
      price: "$79.99",
      originalPrice: null,
      image: "/placeholder.svg",
      rating: 4.7,
      reviews: 203,
      condition: t('products.condition.new'),
      conditionColor: "bg-medical-green text-white",
      category: "Monitoring"
    },
    {
      id: 5,
      name: "Defibrillator AED",
      price: "$2,199.99",
      originalPrice: "$2,599.99",
      image: "/placeholder.svg",
      rating: 4.9,
      reviews: 45,
      condition: t('products.condition.refurbished'),
      conditionColor: "bg-medical-blue text-white",
      category: "Emergency"
    },
    {
      id: 6,
      name: "X-Ray Film Viewer",
      price: "$189.99",
      originalPrice: null,
      image: "/placeholder.svg",
      rating: 4.5,
      reviews: 78,
      condition: t('products.condition.new'),
      conditionColor: "bg-medical-green text-white",
      category: "Imaging"
    },
    {
      id: 7,
      name: "Otoscope Professional",
      price: "$149.99",
      originalPrice: "$199.99",
      image: "/placeholder.svg",
      rating: 4.7,
      reviews: 156,
      condition: t('products.condition.new'),
      conditionColor: "bg-medical-green text-white",
      category: "Diagnostic"
    },
    {
      id: 8,
      name: "Thermometer Digital",
      price: "$24.99",
      originalPrice: null,
      image: "/placeholder.svg",
      rating: 4.4,
      reviews: 234,
      condition: t('products.condition.new'),
      conditionColor: "bg-medical-green text-white",
      category: "Diagnostic"
    }
  ];

  const ProductCard = ({ product }: { product: any }) => (
    <Card className="group hover:shadow-elegant transition-all duration-300 hover:scale-105 animate-fade-in">
      <CardContent className="p-4">
        <div className="relative mb-4">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="absolute top-2 left-2">
            <Badge className={product.conditionColor}>{product.condition}</Badge>
          </div>
          <div className="absolute top-2 right-2">
            <Package className="w-5 h-5 text-muted-foreground" />
          </div>
          {product.originalPrice && (
            <div className="absolute bottom-2 right-2">
              <Badge className="bg-medical-red text-white">
                Save {(parseFloat(product.originalPrice.replace('$', '')) - parseFloat(product.price.replace('$', ''))).toFixed(0)}$
              </Badge>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs">{product.category}</Badge>
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{product.name}</h3>
          
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-500 text-sm">
              {"★".repeat(Math.floor(product.rating))}
              {"☆".repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviews})
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-primary">{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through ml-2">
                  {product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Button className="flex-1 bg-gradient-hero hover:scale-105 transition-transform">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Button variant="outline" size="sm">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 font-display">{t('products.featured')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('products.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center animate-fade-in">
          <Button size="lg" variant="outline" className="hover:scale-105 transition-transform">
            {t('products.viewAll')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
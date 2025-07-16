import { useState } from "react";
import { Star, Heart, ShoppingCart, Package, Filter, Search, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Products = () => {
  console.log("Products component rendering");
  console.log("Window location:", window.location.href);
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const products = [
    {
      id: 1,
      name: "Digital Stethoscope Pro",
      price: 299.99,
      originalPrice: 399.99,
      image: "/placeholder.svg",
      rating: 4.8,
      reviews: 124,
      condition: "new",
      category: "Diagnostic",
      description: "Professional-grade digital stethoscope with noise cancellation and recording capabilities. Perfect for cardiac and pulmonary examinations.",
      features: ["Noise Cancellation", "Recording Function", "Wireless Connectivity", "Long Battery Life"],
      inStock: true,
      stockCount: 15
    },
    {
      id: 2,
      name: "Surgical Scissors Set",
      price: 89.99,
      originalPrice: null,
      image: "/placeholder.svg",
      rating: 4.6,
      reviews: 89,
      condition: "new",
      category: "Surgical",
      description: "Complete set of high-quality surgical scissors made from medical-grade stainless steel. Includes various sizes for different procedures.",
      features: ["Stainless Steel", "Sharp Precision", "Autoclave Safe", "Ergonomic Design"],
      inStock: true,
      stockCount: 8
    },
    {
      id: 3,
      name: "Portable Ultrasound",
      price: 1299.99,
      originalPrice: 1599.99,
      image: "/placeholder.svg",
      rating: 4.9,
      reviews: 67,
      condition: "refurbished",
      category: "Imaging",
      description: "Compact and lightweight portable ultrasound device with high-resolution imaging. Ideal for point-of-care diagnostics.",
      features: ["High Resolution", "Portable Design", "Multiple Probes", "Cloud Storage"],
      inStock: true,
      stockCount: 3
    },
    {
      id: 4,
      name: "Blood Pressure Monitor",
      price: 79.99,
      originalPrice: null,
      image: "/placeholder.svg",
      rating: 4.7,
      reviews: 203,
      condition: "new",
      category: "Monitoring",
      description: "Automatic digital blood pressure monitor with large display and memory function for tracking readings over time.",
      features: ["Digital Display", "Memory Function", "Automatic Inflation", "Irregular Heartbeat Detection"],
      inStock: true,
      stockCount: 25
    },
    {
      id: 5,
      name: "Defibrillator AED",
      price: 2199.99,
      originalPrice: 2599.99,
      image: "/placeholder.svg",
      rating: 4.9,
      reviews: 45,
      condition: "refurbished",
      category: "Emergency",
      description: "Automated External Defibrillator with voice prompts and visual indicators. Essential for emergency cardiac care.",
      features: ["Voice Prompts", "Visual Indicators", "Self-Testing", "Long Battery Life"],
      inStock: false,
      stockCount: 0
    },
    {
      id: 6,
      name: "X-Ray Film Viewer",
      price: 189.99,
      originalPrice: null,
      image: "/placeholder.svg",
      rating: 4.5,
      reviews: 78,
      condition: "new",
      category: "Imaging",
      description: "LED backlit X-ray film viewer with adjustable brightness and even light distribution for accurate diagnosis.",
      features: ["LED Backlight", "Adjustable Brightness", "Even Light Distribution", "Wall Mountable"],
      inStock: true,
      stockCount: 12
    },
    {
      id: 7,
      name: "Otoscope Professional",
      price: 149.99,
      originalPrice: 199.99,
      image: "/placeholder.svg",
      rating: 4.7,
      reviews: 156,
      condition: "new",
      category: "Diagnostic",
      description: "Professional otoscope with high-quality optics and LED illumination for clear ear examinations.",
      features: ["LED Illumination", "High-Quality Optics", "Disposable Specula", "Compact Design"],
      inStock: true,
      stockCount: 18
    },
    {
      id: 8,
      name: "Thermometer Digital",
      price: 24.99,
      originalPrice: null,
      image: "/placeholder.svg",
      rating: 4.4,
      reviews: 234,
      condition: "new",
      category: "Diagnostic",
      description: "Fast and accurate digital thermometer with flexible tip and fever alarm for reliable temperature readings.",
      features: ["Fast Reading", "Flexible Tip", "Fever Alarm", "Memory Function"],
      inStock: true,
      stockCount: 50
    }
  ];

  const categories = ["all", "Diagnostic", "Surgical", "Imaging", "Monitoring", "Emergency"];
  const conditions = ["all", "new", "refurbished"];

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "all" || product.category === selectedCategory) &&
      (selectedCondition === "all" || product.condition === selectedCondition)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

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
            <Badge className={getConditionColor(product.condition)}>
              {product.condition === "new" ? t('products.condition.new') : t('products.condition.refurbished')}
            </Badge>
          </div>
          <div className="absolute top-2 right-2">
            <Package className="w-5 h-5 text-muted-foreground" />
          </div>
          {product.originalPrice && (
            <div className="absolute bottom-2 right-2">
              <Badge className="bg-medical-red text-white">
                Save ${(product.originalPrice - product.price).toFixed(0)}
              </Badge>
            </div>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs">{product.category}</Badge>
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
          
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
              <span className="text-xl font-bold text-primary">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through ml-2">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.inStock ? `In Stock (${product.stockCount})` : "Out of Stock"}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Button 
            className="flex-1 bg-gradient-hero hover:scale-105 transition-transform" 
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
          <Button variant="outline" size="sm">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  const ProductListItem = ({ product }: { product: any }) => (
    <Card className="group hover:shadow-elegant transition-all duration-300 animate-fade-in">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative w-32 h-32 flex-shrink-0">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute top-1 left-1">
              <Badge className={`${getConditionColor(product.condition)} text-xs`}>
                {product.condition === "new" ? t('products.condition.new') : t('products.condition.refurbished')}
              </Badge>
            </div>
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="outline" className="text-xs mb-1">{product.category}</Badge>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary">${product.price}</div>
                {product.originalPrice && (
                  <div className="text-sm text-muted-foreground line-through">
                    ${product.originalPrice}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-500 text-sm">
                  {"★".repeat(Math.floor(product.rating))}
                  {"☆".repeat(5 - Math.floor(product.rating))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews})
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.inStock ? `In Stock (${product.stockCount})` : "Out of Stock"}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {product.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="secondary" className="text-xs">{feature}</Badge>
              ))}
              {product.features.length > 3 && (
                <span className="text-xs text-muted-foreground">+{product.features.length - 3} more</span>
              )}
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button 
                className="bg-gradient-hero hover:scale-105 transition-transform" 
                disabled={!product.inStock}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="py-8 bg-background">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 font-display">Medical Equipment</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our comprehensive collection of professional medical equipment
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-card rounded-lg p-6 mb-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map(condition => (
                    <SelectItem key={condition} value={condition}>
                      {condition === "all" ? "All Conditions" : condition === "new" ? "New" : "Refurbished"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="flex-1"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex-1"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Showing {filteredProducts.length} of {products.length} products</span>
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Products Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <ProductListItem key={product.id} product={product} />
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
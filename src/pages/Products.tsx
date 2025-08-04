import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Star, Heart, ShoppingCart, Package, Filter, Search, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";

const Products = () => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
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
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories([{ id: 'all', name: 'All Categories' }, ...(data || [])]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Handle URL parameters for search and category
  useEffect(() => {
    const searchParam = searchParams.get('search');
    const categoryParam = searchParams.get('category');
    
    console.log("URL search params:", { searchParam, categoryParam });
    
    if (searchParam) {
      console.log("Setting search term from URL:", searchParam);
      setSearchTerm(searchParam);
    }
    
    if (categoryParam) {
      console.log("Setting category from URL:", categoryParam);
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const conditions = ["all", "new", "refurbished"];

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = searchTerm === "" || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "all" || 
        selectedCategory === "All Categories" ||
        product.categories?.name === selectedCategory;
      
      const matchesCondition = selectedCondition === "all" || 
        product.condition === selectedCondition;
        
      return matchesSearch && matchesCategory && matchesCondition;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return Number(a.price) - Number(b.price);
        case "price-high":
          return Number(b.price) - Number(a.price);
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

  const ProductCard = ({ product }: { product: any }) => {
    const handleAddToCart = () => {
      addToCart(product.id);
    };

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
            {(product.stock_quantity === 0 || !product.is_active) && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <Badge variant="destructive">Out of Stock</Badge>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Badge variant="outline" className="text-xs">{product.categories?.name || 'Uncategorized'}</Badge>
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
            
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xl font-bold text-primary">₾{product.price}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity})` : "Out of Stock"}
              </span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <div className="flex gap-2 w-full">
            <Button 
              className="flex-1 bg-gradient-hero hover:scale-105 transition-transform" 
              disabled={product.stock_quantity === 0}
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.stock_quantity > 0 ? "Add to Cart" : "Out of Stock"}
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

  const ProductListItem = ({ product }: { product: any }) => {
    const handleAddToCart = () => {
      addToCart(product.id);
    };

    return (
      <Card 
        className="group hover:shadow-elegant transition-all duration-300 animate-fade-in cursor-pointer"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative w-32 h-32 flex-shrink-0">
              <img 
                src={product.image_url || "/placeholder.svg"} 
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute top-1 left-1">
                <Badge className={`${getConditionColor(product.condition)} text-xs`}>
                  {product.condition === "new" ? t('products.condition.new') : t('products.condition.refurbished')}
                </Badge>
              </div>
              {(product.stock_quantity === 0 || !product.is_active) && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                  <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="text-xs mb-1">{product.categories?.name || 'Uncategorized'}</Badge>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.description}</p>
                  {product.manufacturer && (
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="font-medium">Manufacturer:</span> {product.manufacturer}
                    </p>
                  )}
                  {product.origin_country && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Origin:</span> {product.origin_country}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary">₾{product.price}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity})` : "Out of Stock"}
                </span>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  className="bg-gradient-hero hover:scale-105 transition-transform" 
                  disabled={product.stock_quantity === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.stock_quantity > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

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
                    <SelectItem key={category.id || category} value={category.name || category}>
                      {category.name || (category === "all" ? "All Categories" : category)}
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
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading products...</p>
            </div>
          ) : viewMode === "grid" ? (
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

          {!loading && filteredProducts.length === 0 && (
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
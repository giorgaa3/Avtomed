import { Search, Shield, Truck, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import heroImage from "@/assets/medical-hero-new.jpg";

const Hero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch search suggestions when user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSearchSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, image_url, categories(name)')
          .eq('is_active', true)
          .ilike('name', `%${searchTerm}%`)
          .limit(5);

        if (error) throw error;
        setSearchSuggestions(data || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (productName: string) => {
    setSearchTerm(productName);
    navigate(`/products?search=${encodeURIComponent(productName)}`);
    setShowSuggestions(false);
  };
  
  return (
    <section className="relative bg-gradient-hero text-primary-foreground overflow-hidden">
      {/* Background image overlay */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>
      
      <div className="relative container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto animate-fade-in-up">
          <h1 className="text-5xl font-bold mb-6 font-display leading-tight">
            {t('hero.title')} 
            <span className="text-yellow-300 animate-bounce-gentle"> {t('hero.titleHighlight')}</span>
          </h1>
          <p className="text-xl mb-8 text-primary-foreground/90 leading-relaxed animate-fade-in">
            {t('hero.description')}
          </p>
          
          {/* Enhanced search */}
          <div className="bg-white rounded-lg p-4 shadow-medical mb-8 animate-scale-in transition-all duration-300 hover:shadow-elegant relative">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1 relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors duration-300" />
                  <Input 
                    className="pl-12 pr-4 py-3 text-lg border-0 focus:ring-2 focus:ring-primary transition-all duration-300 focus:scale-[1.02]" 
                    placeholder={t('hero.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                </div>
                
                {/* Search Suggestions */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-background border rounded-md shadow-lg z-50 mt-1">
                    {searchSuggestions.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer border-b last:border-b-0"
                        onClick={() => handleSuggestionClick(product.name)}
                      >
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm text-foreground">{product.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {product.categories?.name} • ₾{product.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button 
                type="submit"
                size="lg" 
                className="px-8 bg-gradient-hero hover:bg-primary-dark transition-all duration-300 hover:scale-105 hover:shadow-lg animate-glow"
                onClick={handleSearchClick}
              >
                {t('hero.searchButton')}
              </Button>
            </form>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-3 gap-6 text-center animate-fade-in">
            <div className="flex flex-col items-center group transition-all duration-300 hover:scale-110">
              <Shield className="w-8 h-8 mb-2 text-yellow-300 group-hover:animate-bounce-gentle" />
              <div className="text-sm font-medium font-sans">{t('hero.fdaCertified')}</div>
              <div className="text-xs text-primary-foreground/80">{t('hero.fdaDescription')}</div>
            </div>
            <div className="flex flex-col items-center group transition-all duration-300 hover:scale-110">
              <Truck className="w-8 h-8 mb-2 text-yellow-300 group-hover:animate-bounce-gentle" />
              <div className="text-sm font-medium font-sans">{t('hero.freeShipping')}</div>
              
            </div>
            <div className="flex flex-col items-center group transition-all duration-300 hover:scale-110">
              <Award className="w-8 h-8 mb-2 text-yellow-300 group-hover:animate-bounce-gentle" />
              <div className="text-sm font-medium font-sans">{t('hero.warranty')}</div>
              <div className="text-xs text-primary-foreground/80">{t('hero.warrantyDescription')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
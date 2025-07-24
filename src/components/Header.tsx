import { useState, useEffect } from "react";
import { ShoppingCart, User, Menu, Facebook, LogOut, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";
import CategoriesDropdown from "./CategoriesDropdown";
import { CartButton } from "./Cart";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

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

  const handleSuggestionClick = (productName: string) => {
    setSearchTerm(productName);
    navigate(`/products?search=${encodeURIComponent(productName)}`);
    setShowSuggestions(false);
  };
  
  return (
    <header className="bg-background border-b border-border shadow-subtle">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>📧 {t('header.support')}</span>
            <span>📞 {t('header.phone')}</span>
            <a 
              href="https://www.facebook.com/anarmedgeorgia" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors duration-300 hover:scale-105"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span>{t('header.freeShipping')}</span>
            <span>{t('header.certified')}</span>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="group flex items-center gap-3 hover:scale-105 transition-all duration-300 ease-in-out">
              <div className="relative">
                <img 
                  src="/lovable-uploads/29063f06-8447-4719-96af-dddba4e78f67.png" 
                  alt="AvtoMed Logo" 
                  className="h-12 w-auto transform transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 scale-110"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-primary font-display animate-fade-in group-hover:text-primary/90 transition-colors duration-300">
                  AvtoMed
                </span>
                <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all duration-300 font-medium">
                  Medical Excellence
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search medical equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-10 pr-4 w-full"
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
                        <div className="font-medium text-sm">{product.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {product.categories?.name} • ₾{product.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105">
                    <User className="w-4 h-4 mr-2" />
                    {user.user_metadata?.full_name || user.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full">
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="w-full">
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="w-full">
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105">
                  <User className="w-4 h-4 mr-2" />
                  {t('header.account')}
                </Button>
              </Link>
            )}
            <CartButton />
            <Button className="bg-gradient-hero transition-all duration-300 hover:scale-105 hover:shadow-lg animate-glow">
              {t('header.listEquipment')}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-between py-3 border-t border-border">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="w-4 h-4 mr-2" />
                {t('header.categories')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0" align="start">
              <CategoriesDropdown />
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm hover:text-primary transition-all duration-300 hover:scale-105 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">{t('header.main')}</Link>
            <Link to="/about" className="text-sm hover:text-primary transition-all duration-300 hover:scale-105 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">{t('header.aboutUs')}</Link>
            <Link to="/products" className="text-sm hover:text-primary transition-all duration-300 hover:scale-105 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">{t('header.products')}</Link>
            <a href="#" className="text-sm hover:text-primary transition-all duration-300 hover:scale-105 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">{t('header.catalogue')}</a>
            <Link to="/contact" className="text-sm hover:text-primary transition-all duration-300 hover:scale-105 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">{t('header.contact')}</Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="bg-background border-b border-border shadow-subtle">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>📧 support@medicalmarket.com</span>
            <span>📞 1-800-MED-EQUIP</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Free Shipping on Orders $500+</span>
            <span>ISO 13485 Certified</span>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-primary font-display animate-fade-in">
              🏥 MedicalMarket
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                className="pl-10 pr-4 py-2 w-full" 
                placeholder="Search medical instruments..."
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105">
              <User className="w-4 h-4 mr-2" />
              Account
            </Button>
            <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart (0)
            </Button>
            <Button className="bg-gradient-hero transition-all duration-300 hover:scale-105 hover:shadow-lg animate-glow">
              List Equipment
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-between py-3 border-t border-border">
          <Button variant="ghost" size="sm">
            <Menu className="w-4 h-4 mr-2" />
            Categories
          </Button>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm hover:text-primary transition-all duration-300 hover:scale-105 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">Main</a>
            <a href="#" className="text-sm hover:text-primary transition-all duration-300 hover:scale-105 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">About Us</a>
            <a href="#" className="text-sm hover:text-primary transition-all duration-300 hover:scale-105 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">Production</a>
            <a href="#" className="text-sm hover:text-primary transition-all duration-300 hover:scale-105 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">Catalogue</a>
            <a href="#" className="text-sm hover:text-primary transition-all duration-300 hover:scale-105 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">Contact</a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
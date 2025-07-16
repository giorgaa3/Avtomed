import { Search, ShoppingCart, User, Menu, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const { t } = useLanguage();
  
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
            <Link to="/" className="text-2xl font-bold text-primary font-display animate-fade-in hover:scale-105 transition-transform duration-300">
              🏥 AvtoMed
            </Link>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                className="pl-10 pr-4 py-2 w-full" 
                placeholder={t('header.search')}
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105">
              <User className="w-4 h-4 mr-2" />
              {t('header.account')}
            </Button>
            <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105">
              <ShoppingCart className="w-4 h-4 mr-2" />
              {t('header.cart')} (0)
            </Button>
            <Button className="bg-gradient-hero transition-all duration-300 hover:scale-105 hover:shadow-lg animate-glow">
              {t('header.listEquipment')}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center justify-between py-3 border-t border-border">
          <Button variant="ghost" size="sm">
            <Menu className="w-4 h-4 mr-2" />
            {t('header.categories')}
          </Button>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm hover:text-primary transition-all duration-300 hover:scale-105 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">{t('header.main')}</Link>
            <Link to="/about" className="text-sm hover:text-primary transition-all duration-300 hover:scale-105 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">{t('header.aboutUs')}</Link>
            <a href="#" className="text-sm hover:text-primary transition-all duration-300 hover:scale-105 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">{t('header.production')}</a>
            <a href="#" className="text-sm hover:text-primary transition-all duration-300 hover:scale-105 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">{t('header.catalogue')}</a>
            <a href="#" className="text-sm hover:text-primary transition-all duration-300 hover:scale-105 relative after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100">{t('header.contact')}</a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
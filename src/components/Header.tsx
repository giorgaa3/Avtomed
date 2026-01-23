import { useState } from "react";
import { User, Menu, Facebook, LogOut } from "lucide-react";
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

import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="bg-background border-b border-border shadow-subtle">
      <div className="container mx-auto px-4">
        {/* Top bar - hidden on mobile */}
        <div className="hidden md:flex items-center justify-between py-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="truncate">📧 {t('header.support')}</span>
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
            <span>{t('header.certified')}</span>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-3 md:py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="group flex items-center gap-2 md:gap-3 hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out">
              <div className="relative">
                <img 
                  src="/lovable-uploads/29063f06-8447-4719-96af-dddba4e78f67.png" 
                  alt="AvtoMed Logo" 
                  className="h-8 md:h-12 w-auto transform transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110 group-active:rotate-0 group-active:scale-95"
                />
              </div>
              <span className="text-xl md:text-2xl font-bold text-primary font-display transition-all duration-200 group-active:text-primary/80">
                AvtoMed
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </Button>

          {/* Right actions - hidden on mobile */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="transition-all duration-300 hover:scale-105">
                    <User className="w-4 h-4 mr-2" />
                    <span className="max-w-[120px] truncate">
                      {user.user_metadata?.full_name || user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full">
                      My Profile
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
            
            <Button className="bg-gradient-hero transition-all duration-300 hover:scale-105 hover:shadow-lg">
              {t('header.listEquipment')}
            </Button>
          </div>
        </div>

        {/* Navigation - hidden on mobile */}
        <nav className="hidden md:flex items-center justify-between py-3 border-t border-border">
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
            <Link to="/" className="text-sm hover:text-primary transition-all duration-300 hover:scale-105">{t('header.main')}</Link>
            <Link to="/about" className="text-sm hover:text-primary transition-all duration-300 hover:scale-105">{t('header.aboutUs')}</Link>
            <Link to="/products" className="text-sm hover:text-primary transition-all duration-300 hover:scale-105">{t('header.products')}</Link>
            <a href="#" className="text-sm hover:text-primary transition-all duration-300 hover:scale-105">{t('header.catalogue')}</a>
            <Link to="/contact" className="text-sm hover:text-primary transition-all duration-300 hover:scale-105">{t('header.contact')}</Link>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-sm py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>{t('header.main')}</Link>
              <Link to="/about" className="text-sm py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>{t('header.aboutUs')}</Link>
              <Link to="/products" className="text-sm py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>{t('header.products')}</Link>
              <a href="#" className="text-sm py-2 hover:text-primary">{t('header.catalogue')}</a>
              <Link to="/contact" className="text-sm py-2 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>{t('header.contact')}</Link>
              
              <div className="pt-3 border-t border-border flex flex-col gap-2">
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2" />
                        My Profile
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => signOut()}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      {t('header.account')}
                    </Button>
                  </Link>
                )}
                <Button className="bg-gradient-hero w-full">
                  {t('header.listEquipment')}
                </Button>
              </div>
              
              <div className="pt-3 border-t border-border">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ka';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'header.account': 'Account',
    'header.cart': 'Cart',
    'header.listEquipment': 'List Equipment',
    'header.categories': 'Categories',
    'header.main': 'Main',
    'header.aboutUs': 'About Us',
    'header.production': 'Production',
    'header.catalogue': 'Catalogue',
    'header.contact': 'Contact',
    'header.search': 'Search medical instruments...',
    'header.support': 'support@avtomed.com',
    'header.phone': '1-800-MED-EQUIP',
    'header.freeShipping': 'Free Shipping on Orders $500+',
    'header.certified': 'ISO 13485 Certified',
    
    // Hero
    'hero.title': 'Your Trusted Partner for',
    'hero.titleHighlight': 'Medical Equipment',
    'hero.description': 'Discover thousands of certified medical instruments from trusted sellers. New, refurbished, and used equipment with full warranty and support.',
    'hero.searchPlaceholder': 'Search by brand, model, or equipment type...',
    'hero.searchButton': 'Search Equipment',
    'hero.fdaCertified': 'FDA Certified',
    'hero.fdaDescription': 'All equipment verified',
    'hero.freeShipping': 'Free Shipping',
    'hero.freeShippingDescription': 'Orders over $500',
    'hero.warranty': 'Warranty Included',
    'hero.warrantyDescription': 'Up to 2 years coverage',
    
    // Categories
    'categories.title': 'Browse by Category',
    'categories.diagnostic': 'Diagnostic Equipment',
    'categories.surgical': 'Surgical Instruments',
    'categories.imaging': 'Imaging Equipment',
    'categories.laboratory': 'Laboratory',
    'categories.monitoring': 'Patient Monitoring',
    'categories.refurbished': 'Refurbished',
    
    // Products
    'products.featured': 'Featured Medical Equipment',
    'products.condition.new': 'New',
    'products.condition.refurbished': 'Refurbished',
    'products.condition.used': 'Used',
    'products.viewAll': 'View All Equipment',
    
    // Footer
    'footer.company': 'Company',
    'footer.categories': 'Categories',
    'footer.support': 'Support',
    'footer.followUs': 'Follow Us',
    'footer.aboutUs': 'About Us',
    'footer.careers': 'Careers',
    'footer.investors': 'Investors',
    'footer.news': 'News',
    'footer.contactUs': 'Contact Us',
    'footer.shipping': 'Shipping Info',
    'footer.returns': 'Returns',
    'footer.warranty': 'Warranty',
    'footer.rights': 'All rights reserved.',
  },
  ka: {
    // Header
    'header.account': 'ანგარიში',
    'header.cart': 'კალათა',
    'header.listEquipment': 'დამატება',
    'header.categories': 'კატეგორიები',
    'header.main': 'მთავარი',
    'header.aboutUs': 'ჩვენ შესახებ',
    'header.production': 'წარმოება',
    'header.catalogue': 'კატალოგი',
    'header.contact': 'კონტაქტი',
    'header.search': 'მოძებნეთ სამედიცინო ინსტრუმენტები...',
    'header.support': 'support@avtomed.com',
    'header.phone': '1-800-MED-EQUIP',
    'header.freeShipping': 'უფასო მიწოდება $500+ შეკვეთებზე',
    'header.certified': 'ISO 13485 სერტიფიკატი',
    
    // Hero
    'hero.title': 'თქვენი სანდო პარტნიორი',
    'hero.titleHighlight': 'სამედიცინო აღჭურვილობისთვის',
    'hero.description': 'აღმოაჩინეთ ათასობით სერტიფიცირებული სამედიცინო ინსტრუმენტი სანდო გამყიდველებისგან. ახალი, განახლებული და გამოყენებული აღჭურვილობა სრული გარანტიითა და მხარდაჭერით.',
    'hero.searchPlaceholder': 'მოძებნეთ ბრენდის, მოდელის ან აღჭურვილობის ტიპის მიხედვით...',
    'hero.searchButton': 'ძიება',
    'hero.fdaCertified': 'FDA სერტიფიკატი',
    'hero.fdaDescription': 'ყველა აღჭურვილობა ვერიფიცირებულია',
    'hero.freeShipping': 'უფასო მიწოდება',
    'hero.freeShippingDescription': '$500-ზე მეტი შეკვეთები',
    'hero.warranty': 'გარანტია ჩართული',
    'hero.warrantyDescription': '2 წლამდე დაფარვა',
    
    // Categories
    'categories.title': 'კატეგორიების მიხედვით',
    'categories.diagnostic': 'დიაგნოსტიკური აღჭურვილობა',
    'categories.surgical': 'ქირურგიული ინსტრუმენტები',
    'categories.imaging': 'გამოსახულების აღჭურვილობა',
    'categories.laboratory': 'ლაბორატორია',
    'categories.monitoring': 'პაციენტის მონიტორინგი',
    'categories.refurbished': 'განახლებული',
    
    // Products
    'products.featured': 'რჩეული სამედიცინო აღჭურვილობა',
    'products.condition.new': 'ახალი',
    'products.condition.refurbished': 'განახლებული',
    'products.condition.used': 'გამოყენებული',
    'products.viewAll': 'ყველას ნახვა',
    
    // Footer
    'footer.company': 'კომპანია',
    'footer.categories': 'კატეგორიები',
    'footer.support': 'მხარდაჭერა',
    'footer.followUs': 'გამოგვყევით',
    'footer.aboutUs': 'ჩვენ შესახებ',
    'footer.careers': 'კარიერა',
    'footer.investors': 'ინვესტორები',
    'footer.news': 'სიახლეები',
    'footer.contactUs': 'დაგვიკავშირდით',
    'footer.shipping': 'მიწოდების ინფო',
    'footer.returns': 'დაბრუნება',
    'footer.warranty': 'გარანტია',
    'footer.rights': 'ყველა უფლება დაცულია.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
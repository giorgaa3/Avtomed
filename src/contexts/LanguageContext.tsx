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
    'categories.title': 'Medical Equipment Categories',
    'categories.description': 'Find the medical equipment you need from our comprehensive categories',
    'categories.diagnostic': 'Diagnostic Equipment',
    'categories.surgical': 'Surgical Instruments',
    'categories.imaging': 'Imaging Equipment',
    'categories.laboratory': 'Laboratory',
    'categories.monitoring': 'Patient Monitoring',
    'categories.refurbished': 'Refurbished',
    
    // Products
    'products.featured': 'Featured Medical Equipment',
    'products.description': 'Discover our top-rated medical instruments from trusted manufacturers',
    'products.condition.new': 'New',
    'products.condition.refurbished': 'Refurbished',
    'products.condition.used': 'Used',
    'products.viewAll': 'View All Products',
    
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
    
    // About Us
    'about.heroTitle': 'About AvtoMed',
    'about.heroSubtitle': 'Years of Excellence in Medical Equipment',
    'about.heroDescription': 'Established in 2012, AvtoMed has been serving the Georgian healthcare market with premium medical equipment and supplies.',
    'about.yearsExperience': 'Years Experience',
    'about.clientsServed': 'Clients Served',
    'about.countries': 'Partner Countries',
    'about.certified': 'Quality Certified',
    'about.storyTitle': 'Our Story',
    'about.companyStory': 'LLC "Anarmed" was established in the Georgian market in 2012. The company\'s main business area includes the sale of disposable medical consumables, surgical sutures, resuscitation and electrical goods, and equipment. Since its establishment, the company has been supplying hospitals and pharmacy networks in Tbilisi and other cities of Georgia with high-quality products manufactured abroad. LLC "Anarmed" constantly expands its assortment according to the needs of its customers.',
    'about.missionTitle': 'Our Mission',
    'about.mission': 'To provide Georgian healthcare institutions with the highest quality medical equipment and supplies, ensuring patient safety and medical excellence through reliable partnerships and certified products.',
    'about.valuesTitle': 'Our Values',
    'about.qualityTitle': 'Premium Quality',
    'about.qualityDesc': 'We source only the highest quality medical equipment that meets international standards and certifications.',
    'about.reliabilityTitle': 'Reliability',
    'about.reliabilityDesc': 'Our products come with comprehensive warranties and ongoing support to ensure uninterrupted healthcare services.',
    'about.serviceTitle': 'Customer Service',
    'about.serviceDesc': 'We provide personalized service and technical support to meet the unique needs of each healthcare facility.',
    'about.partnersTitle': 'Our Partners',
    'about.partnersDescription': 'We collaborate with leading manufacturers who produce high-quality products with modern equipment that meets European standards.',
    'about.certificationText': 'All our partners maintain the highest quality standards and certifications:',
    'about.ctaTitle': 'Ready to Partner with Us?',
    'about.ctaDescription': 'Join hundreds of satisfied healthcare providers who trust AvtoMed for their medical equipment needs.',
    'about.contactButton': 'Contact Us Today',
    'about.catalogueButton': 'View Our Catalogue',
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
    'categories.title': 'სამედიცინო აღჭურვილობის კატეგორიები',
    'categories.description': 'იპოვეთ საჭირო სამედიცინო აღჭურვილობა ჩვენი ფართო კატეგორიებიდან',
    'categories.diagnostic': 'დიაგნოსტიკური აღჭურვილობა',
    'categories.surgical': 'ქირურგიული ინსტრუმენტები',
    'categories.imaging': 'გამოსახულების აღჭურვილობა',
    'categories.laboratory': 'ლაბორატორია',
    'categories.monitoring': 'პაციენტის მონიტორინგი',
    'categories.refurbished': 'განახლებული',
    
    // Products
    'products.featured': 'რჩეული სამედიცინო აღჭურვილობა',
    'products.description': 'აღმოაჩინეთ ჩვენი ყველაზე მაღალ რეიტინგულ სამედიცინო ინსტრუმენტები სანდო მწარმოებლებისგან',
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
    
    // About Us
    'about.heroTitle': 'ავტომედის შესახებ',
    'about.heroSubtitle': 'წლოვანი გამოცდილება სამედიცინო აღჭურვილობაში',
    'about.heroDescription': '2012 წელს დაარსებული ავტომედი ემსახურება ქართულ ჯანდაცვის ბაზარს პრემიუმ სამედიცინო აღჭურვილობითა და მასალებით.',
    'about.yearsExperience': 'წლოვანი გამოცდილება',
    'about.clientsServed': 'მომსახურებული კლიენტი',
    'about.countries': 'პარტნიორი ქვეყანა',
    'about.certified': 'ხარისხობრივი სერტიფიკატი',
    'about.storyTitle': 'ჩვენი ისტორია',
    'about.companyStory': 'შპს „ანარმედი"-ქართულ ბაზარზე დაარსდა 2012 წელს, კომპანიის ძირითადი საქმიანობის სფეროს წარმოადგენს ერთჯერადი სამედიცინო სახარჯი მასალების, ქირურგიული ძაფების, სარეანიმაციო და ელექტრო საქონლის, აპარატურის რეალიზაცია. კომპანია დაარსების დღიდან ამარაგებს თბილისის და საქართველოს სხვა ქალაქების საავადმყოფოებს და სააფთიაქო ქსელებს- უცხოეთში წარმოებული მაღალი ხარისხის პროდუქციით. შპს „ანარმედი" მუდმივად აფართოებს ასორტიმენტს თავისი მომხმარებლის მოთხოვნების შესაბამისად.',
    'about.missionTitle': 'ჩვენი მისია',
    'about.mission': 'ქართული ჯანდაცვის დაწესებულებების უზრუნველყოფა უმაღლესი ხარისხის სამედიცინო აღჭურვილობითა და მასალებით, პაციენტთა უსაფრთხოებისა და სამედიცინო ხარისხის უზრუნველსაყოფად სანდო პარტნიორობისა და სერტიფიცირებული პროდუქციის მეშვეობით.',
    'about.valuesTitle': 'ჩვენი ღირებულებები',
    'about.qualityTitle': 'პრემიუმ ხარისხი',
    'about.qualityDesc': 'ჩვენ ვირჩევთ მხოლოდ უმაღლესი ხარისხის სამედიცინო აღჭურვილობას, რომელიც აკმაყოფილებს საერთაშორისო სტანდარტებსა და სერტიფიკაციებს.',
    'about.reliabilityTitle': 'სანდოობა',
    'about.reliabilityDesc': 'ჩვენი პროდუქცია მოდის სრული გარანტიითა და მუდმივი მხარდაჭერით ჯანდაცვის მომსახურების უწყვეტობის უზრუნველსაყოფად.',
    'about.serviceTitle': 'მომხმარებელთა მომსახურება',
    'about.serviceDesc': 'ჩვენ გთავაზობთ პერსონალიზირებულ მომსახურებასა და ტექნიკურ მხარდაჭერას თითოეული ჯანდაცვის დაწესებულების უნიკალური საჭიროებების დასაკმაყოფილებლად.',
    'about.partnersTitle': 'ჩვენი პარტნიორები',
    'about.partnersDescription': 'ჩვენ ვთანამშრომლობთ წამყვან მწარმოებლებთან, რომლებიც აწარმოებენ მაღალი ხარისხის პროდუქციას თანამედროვე აღჭურვილობით, რომელიც აკმაყოფილებს ევროპულ სტანდარტებს.',
    'about.certificationText': 'ჩვენი ყველა პარტნიორი ინარჩუნებს უმაღლეს ხარისხობრივ სტანდარტებსა და სერტიფიკაციებს:',
    'about.ctaTitle': 'მზად ხართ პარტნიორობისთვის?',
    'about.ctaDescription': 'შეუერთდით ასობით კმაყოფილ ჯანდაცვის პროვაიდერს, რომლებიც ენდობიან ავტომედს თავიანთი სამედიცინო აღჭურვილობის საჭიროებებისთვის.',
    'about.contactButton': 'დაგვიკავშირდით დღესვე',
    'about.catalogueButton': 'იხილეთ ჩვენი კატალოგი',
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
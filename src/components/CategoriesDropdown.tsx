import { Heart, CircleDot, Bandage, Package, Scissors, Stethoscope, Baby, Bone, HeartPulse, Zap, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

const CategoriesDropdown = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleCategoryClick = (categoryTitle: string) => {
    navigate(`/products?category=${encodeURIComponent(categoryTitle)}`);
  };

  const handleAllProductsClick = () => {
    navigate('/products');
  };

  const categories = [
    {
      icon: Heart,
      title: t('categories.resuscitation'),
      color: "text-red-500",
    },
    {
      icon: CircleDot,
      title: t('categories.suture'),
      color: "text-blue-500",
    },
    {
      icon: Bandage,
      title: t('categories.bandage'),
      color: "text-green-500",
    },
    {
      icon: Package,
      title: t('categories.consumables'),
      color: "text-purple-500",
    },
    {
      icon: Scissors,
      title: t('categories.metalInstruments'),
      color: "text-primary",
      hasSubcategories: true,
      subcategories: [
        {
          icon: Stethoscope,
          title: t('categories.surgical'),
          color: "text-primary"
        },
        {
          icon: Baby,
          title: t('categories.gynecological'),
          color: "text-pink-500"
        },
        {
          icon: Bone,
          title: t('categories.traumatological'),
          color: "text-orange-500"
        },
        {
          icon: HeartPulse,
          title: t('categories.vascular'),
          color: "text-red-500"
        },
        {
          icon: Zap,
          title: t('categories.angiological'),
          color: "text-yellow-500"
        },
        {
          icon: Activity,
          title: t('categories.cardiacSurgical'),
          color: "text-red-600"
        }
      ]
    }
  ];

  return (
    <div className="w-80 p-4 space-y-3">
      {/* All Products Section */}
      <div className="border-b border-border pb-3">
        <div 
          onClick={handleAllProductsClick}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors font-semibold"
        >
          <Package className="w-5 h-5 text-primary" />
          <span>All Products</span>
        </div>
      </div>

      {/* Individual Categories */}
      {categories.map((category, index) => (
        <div key={index} className="space-y-2">
          <div 
            onClick={() => handleCategoryClick(category.title)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
          >
            <category.icon className={`w-5 h-5 ${category.color}`} />
            <span className="font-medium">{category.title}</span>
          </div>
          
          {category.hasSubcategories && (
            <div className="ml-8 space-y-1">
              {category.subcategories?.map((subcategory, subIndex) => (
                <div 
                  key={subIndex} 
                  onClick={() => handleCategoryClick(subcategory.title)}
                  className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <subcategory.icon className={`w-4 h-4 ${subcategory.color}`} />
                  <span className="text-sm">{subcategory.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoriesDropdown;
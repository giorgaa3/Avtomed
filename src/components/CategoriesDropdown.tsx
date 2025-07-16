import { Heart, Scissors, Bandage, Package, Wrench, Stethoscope, Baby, Bone, HeartPulse, Zap, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const CategoriesDropdown = () => {
  const { t } = useLanguage();

  const categories = [
    {
      icon: Heart,
      title: t('categories.resuscitation'),
      color: "text-red-500",
    },
    {
      icon: Scissors,
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
      icon: Wrench,
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
      {categories.map((category, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors">
            <category.icon className={`w-5 h-5 ${category.color}`} />
            <span className="font-medium">{category.title}</span>
          </div>
          
          {category.hasSubcategories && (
            <div className="ml-8 space-y-1">
              {category.subcategories?.map((subcategory, subIndex) => (
                <div key={subIndex} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors">
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
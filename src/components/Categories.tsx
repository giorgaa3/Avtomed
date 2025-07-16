import { Heart, Scissors, Bandage, Package, Wrench, Stethoscope, Baby, Bone, HeartPulse, Zap, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Categories = () => {
  // Updated component
  const { t } = useLanguage();

  const categories = [
    {
      icon: Heart,
      title: t('categories.resuscitation'),
      description: "Emergency resuscitation equipment",
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      icon: Scissors,
      title: t('categories.suture'),
      description: "Surgical sutures and materials",
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: Bandage,
      title: t('categories.bandage'),
      description: "Medical bandages and dressings",
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      icon: Package,
      title: t('categories.consumables'),
      description: "Medical consumable supplies",
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: Wrench,
      title: t('categories.metalInstruments'),
      description: "Professional metal instruments",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
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
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 font-display">{t('categories.title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('categories.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="space-y-4">
              <Card className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-elegant group animate-fade-in ${category.bgColor}`}>
                <CardContent className="p-6 text-center">
                  <category.icon className={`w-12 h-12 mx-auto mb-4 ${category.color} group-hover:animate-bounce-gentle transition-colors`} />
                  <h3 className="font-semibold mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
              
              {category.hasSubcategories && (
                <div className="grid grid-cols-2 gap-3 ml-4">
                  {category.subcategories?.map((subcategory, subIndex) => (
                    <Card key={subIndex} className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group bg-white border-l-4 border-l-primary">
                      <CardContent className="p-4 text-center">
                        <subcategory.icon className={`w-8 h-8 mx-auto mb-2 ${subcategory.color} group-hover:animate-pulse transition-colors`} />
                        <h4 className="text-xs font-medium">{subcategory.title}</h4>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
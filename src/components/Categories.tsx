import { Heart, CircleDot, Bandage, Package, Scissors, Stethoscope, Baby, Bone, HeartPulse, Zap, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Categories = () => {
  const { t } = useLanguage();

  const mainCategories = [
    {
      icon: Heart,
      title: t('categories.resuscitation'),
      description: "Emergency resuscitation equipment",
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      icon: CircleDot,
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
    }
  ];

  const metalInstruments = {
    icon: Scissors,
    title: t('categories.metalInstruments'),
    description: "Professional surgical instruments",
    color: "text-primary",
    bgColor: "bg-primary/5",
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
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-4 font-display">{t('categories.title')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('categories.description')}
          </p>
        </div>
        
        <div className="space-y-12">
          {/* Main Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainCategories.map((category, index) => (
              <Card key={index} className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-elegant group animate-fade-in ${category.bgColor}`}>
                <CardContent className="p-6 text-center">
                  <category.icon className={`w-12 h-12 mx-auto mb-4 ${category.color} group-hover:animate-bounce-gentle transition-colors`} />
                  <h3 className="font-semibold mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Metal Instruments Section */}
          <div className="max-w-4xl mx-auto">
            <Card className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-elegant group animate-fade-in ${metalInstruments.bgColor} border-2 border-primary/20`}>
              <CardContent className="p-8 text-center">
                <metalInstruments.icon className={`w-16 h-16 mx-auto mb-6 ${metalInstruments.color} group-hover:animate-bounce-gentle transition-colors`} />
                <h3 className="text-2xl font-bold mb-4">{metalInstruments.title}</h3>
                <p className="text-muted-foreground mb-8">{metalInstruments.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {metalInstruments.subcategories.map((subcategory, subIndex) => (
                    <Card key={subIndex} className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg group bg-background border border-border">
                      <CardContent className="p-6 text-center">
                        <subcategory.icon className={`w-10 h-10 mx-auto mb-3 ${subcategory.color} group-hover:animate-pulse transition-colors`} />
                        <h4 className="text-sm font-medium">{subcategory.title}</h4>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
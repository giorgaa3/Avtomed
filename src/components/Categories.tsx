import { Stethoscope, Scissors, Camera, TestTube, Activity, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Categories = () => {
  // Updated component
  const { t } = useLanguage();

  const categories = [
    {
      icon: Stethoscope,
      title: t('categories.diagnostic'),
      description: "ECG, Ultrasound, X-ray machines",
      color: "text-medical-blue",
      bgColor: "bg-medical-blue/10"
    },
    {
      icon: Scissors,
      title: t('categories.surgical'),
      description: "Forceps, Scalpels, Surgical sets",
      color: "text-medical-red",
      bgColor: "bg-medical-red/10"
    },
    {
      icon: Camera,
      title: t('categories.imaging'),
      description: "MRI, CT, Mammography systems",
      color: "text-medical-green",
      bgColor: "bg-medical-green/10"
    },
    {
      icon: TestTube,
      title: t('categories.laboratory'),
      description: "Analyzers, Microscopes, Centrifuges",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Activity,
      title: t('categories.monitoring'),
      description: "Patient monitors, Ventilators",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: RefreshCw,
      title: t('categories.refurbished'),
      description: "Certified pre-owned equipment",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
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
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-elegant group animate-fade-in ${category.bgColor}`}>
              <CardContent className="p-6 text-center">
                <category.icon className={`w-12 h-12 mx-auto mb-4 ${category.color} group-hover:animate-bounce-gentle transition-colors`} />
                <h3 className="font-semibold mb-2">{category.title}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
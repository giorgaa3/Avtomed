import { Stethoscope, Activity, Microscope, Heart, Brain, Thermometer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    name: "Diagnostic Equipment",
    icon: Stethoscope,
    count: 1247,
    description: "Stethoscopes, thermometers, blood pressure monitors"
  },
  {
    name: "Patient Monitoring",
    icon: Activity,
    count: 892,
    description: "Vital signs monitors, ECG machines, pulse oximeters"
  },
  {
    name: "Laboratory Equipment",
    icon: Microscope,
    count: 654,
    description: "Microscopes, centrifuges, analyzers, test equipment"
  },
  {
    name: "Cardiovascular",
    icon: Heart,
    count: 438,
    description: "EKG machines, defibrillators, cardiac monitors"
  },
  {
    name: "Imaging Equipment",
    icon: Brain,
    count: 321,
    description: "Ultrasound, X-ray, MRI, CT scan equipment"
  },
  {
    name: "Surgical Instruments",
    icon: Thermometer,
    count: 976,
    description: "Surgical tools, endoscopes, operating equipment"
  }
];

const Categories = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Browse by Category
          </h2>
          <p className="text-lg text-muted-foreground">
            Find the exact medical equipment you need from our comprehensive categories
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-medical transition-all duration-300 cursor-pointer bg-gradient-card border-0 hover:scale-105"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary-light rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <IconComponent className="w-8 h-8 text-primary group-hover:text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {category.description}
                  </p>
                  <div className="text-primary font-medium">
                    {category.count.toLocaleString()} items available
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
import { Search, Shield, Truck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/medical-hero-new.jpg";

const Hero = () => {
  return (
    <section className="relative bg-gradient-hero text-primary-foreground overflow-hidden">
      {/* Background image overlay */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>
      
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold mb-6">
            Your Trusted Partner for 
            <span className="text-yellow-300"> Medical Equipment</span>
          </h1>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Discover thousands of certified medical instruments from trusted sellers. 
            New, refurbished, and used equipment with full warranty and support.
          </p>
          
          {/* Enhanced search */}
          <div className="bg-white rounded-lg p-4 shadow-medical mb-8">
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input 
                    className="pl-12 pr-4 py-3 text-lg border-0 focus:ring-2 focus:ring-primary" 
                    placeholder="Search by brand, model, or equipment type..."
                  />
                </div>
              </div>
              <Button size="lg" className="px-8 bg-gradient-hero hover:bg-primary-dark">
                Search Equipment
              </Button>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Shield className="w-8 h-8 mb-2 text-yellow-300" />
              <div className="text-sm font-medium">FDA Certified</div>
              <div className="text-xs text-primary-foreground/80">All equipment verified</div>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="w-8 h-8 mb-2 text-yellow-300" />
              <div className="text-sm font-medium">Free Shipping</div>
              <div className="text-xs text-primary-foreground/80">Orders over $500</div>
            </div>
            <div className="flex flex-col items-center">
              <Award className="w-8 h-8 mb-2 text-yellow-300" />
              <div className="text-sm font-medium">Warranty Included</div>
              <div className="text-xs text-primary-foreground/80">Up to 2 years coverage</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
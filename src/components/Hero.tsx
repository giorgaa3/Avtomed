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
        <div className="max-w-3xl animate-fade-in-up">
          <h1 className="text-5xl font-bold mb-6 font-display leading-tight">
            Your Trusted Partner for 
            <span className="text-yellow-300 animate-bounce-gentle"> Medical Equipment</span>
          </h1>
          <p className="text-xl mb-8 text-primary-foreground/90 leading-relaxed animate-fade-in">
            Discover thousands of certified medical instruments from trusted sellers. 
            New, refurbished, and used equipment with full warranty and support.
          </p>
          
          {/* Enhanced search */}
          <div className="bg-white rounded-lg p-4 shadow-medical mb-8 animate-scale-in transition-all duration-300 hover:shadow-elegant">
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors duration-300" />
                  <Input 
                    className="pl-12 pr-4 py-3 text-lg border-0 focus:ring-2 focus:ring-primary transition-all duration-300 focus:scale-[1.02]" 
                    placeholder="Search by brand, model, or equipment type..."
                  />
                </div>
              </div>
              <Button size="lg" className="px-8 bg-gradient-hero hover:bg-primary-dark transition-all duration-300 hover:scale-105 hover:shadow-lg animate-glow">
                Search Equipment
              </Button>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-3 gap-6 text-center animate-fade-in">
            <div className="flex flex-col items-center group transition-all duration-300 hover:scale-110">
              <Shield className="w-8 h-8 mb-2 text-yellow-300 group-hover:animate-bounce-gentle" />
              <div className="text-sm font-medium font-sans">FDA Certified</div>
              <div className="text-xs text-primary-foreground/80">All equipment verified</div>
            </div>
            <div className="flex flex-col items-center group transition-all duration-300 hover:scale-110">
              <Truck className="w-8 h-8 mb-2 text-yellow-300 group-hover:animate-bounce-gentle" />
              <div className="text-sm font-medium font-sans">Free Shipping</div>
              <div className="text-xs text-primary-foreground/80">Orders over $500</div>
            </div>
            <div className="flex flex-col items-center group transition-all duration-300 hover:scale-110">
              <Award className="w-8 h-8 mb-2 text-yellow-300 group-hover:animate-bounce-gentle" />
              <div className="text-sm font-medium font-sans">Warranty Included</div>
              <div className="text-xs text-primary-foreground/80">Up to 2 years coverage</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
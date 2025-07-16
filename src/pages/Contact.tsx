import { Mail, Phone, MapPin, Facebook, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import Map from "@/components/Map";

const Contact = () => {
  const { t, language } = useLanguage();
  const [mapboxToken, setMapboxToken] = useState("");

  const contactInfo = [
    {
      icon: Mail,
      label: language === 'ka' ? 'ელ. ფოსტა' : 'Email',
      value: 'avtandilzviadadze@yahho.com',
      color: 'text-medical-blue'
    },
    {
      icon: Phone,
      label: language === 'ka' ? 'ტელეფონი' : 'Phone',
      value: '0322 53 03 03',
      color: 'text-medical-green'
    },
    {
      icon: MapPin,
      label: language === 'ka' ? 'მისამართი' : 'Address',
      value: language === 'ka' ? 'თბილისი, საქართველო' : 'Tbilisi, Georgia',
      color: 'text-medical-red'
    },
    {
      icon: Clock,
      label: language === 'ka' ? 'სამუშაო საათები' : 'Business Hours',
      value: language === 'ka' ? 'ორშ-პარ: 9:00-18:00' : 'Mon-Fri: 9:00-18:00',
      color: 'text-primary'
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-primary-foreground py-20">
        <div className="absolute inset-0 bg-primary/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 font-display animate-fade-in">
            {language === 'ka' ? 'კონტაქტი' : 'Contact Us'}
          </h1>
          <p className="text-xl max-w-2xl mx-auto animate-fade-in">
            {language === 'ka' 
              ? 'დაგვიკავშირდით და მიიღეთ პროფესიონალური კონსულტაცია სამედიცინო აღჭურვილობის შესახებ'
              : 'Get in touch with us for professional medical equipment consultation and support'
            }
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Details */}
            <div className="space-y-8">
              <div className="animate-fade-in">
                <h2 className="text-3xl font-bold mb-8 font-display">
                  {language === 'ka' ? 'საკონტაქტო ინფორმაცია' : 'Contact Information'}
                </h2>
                
                <div className="grid gap-6">
                  {contactInfo.map((info, index) => (
                    <Card key={index} className="p-6 hover:shadow-elegant transition-all duration-300 hover:scale-105">
                      <CardContent className="flex items-center gap-4 p-0">
                        <div className={`p-3 rounded-lg bg-muted ${info.color}`}>
                          <info.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{info.label}</h3>
                          <p className="text-muted-foreground">{info.value}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold mb-4">
                  {language === 'ka' ? 'სოციალური ქსელები' : 'Follow Us'}
                </h3>
                <div className="flex gap-4">
                  <a 
                    href="https://www.facebook.com/anarmedgeorgia" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                  >
                    <Facebook className="w-5 h-5" />
                    <span>{language === 'ka' ? 'ფეისბუქი' : 'Facebook'}</span>
                  </a>
                </div>
              </div>

              {/* Contact Form */}
              <Card className="p-6 animate-scale-in">
                <CardContent className="p-0">
                  <h3 className="text-xl font-semibold mb-4">
                    {language === 'ka' ? 'შეტყობინება გამოგვიგზავნეთ' : 'Send us a Message'}
                  </h3>
                  <div className="space-y-4">
                    <Input 
                      placeholder={language === 'ka' ? 'თქვენი სახელი' : 'Your Name'} 
                      className="w-full"
                    />
                    <Input 
                      type="email" 
                      placeholder={language === 'ka' ? 'ელ. ფოსტა' : 'Email Address'} 
                      className="w-full"
                    />
                    <textarea 
                      className="w-full p-3 border border-border rounded-md min-h-[120px] resize-none"
                      placeholder={language === 'ka' ? 'თქვენი შეტყობინება...' : 'Your Message...'}
                    ></textarea>
                    <Button className="w-full bg-gradient-hero hover:scale-105 transition-transform">
                      {language === 'ka' ? 'გაგზავნა' : 'Send Message'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Map Section */}
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-8 font-display">
                {language === 'ka' ? 'ჩვენი მდებარეობა' : 'Our Location'}
              </h2>
              
              {/* Mapbox Token Input */}
              <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  {language === 'ka' 
                    ? 'რუკის ჩვენებისთვის შეიყვანეთ Mapbox Token'
                    : 'Enter your Mapbox token to display the map'
                  }
                </p>
                <Input 
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  placeholder="pk.eyJ1Ijoi..."
                  className="mb-2"
                />
                <p className="text-xs text-muted-foreground">
                  {language === 'ka'
                    ? 'Token მიიღეთ: https://mapbox.com/'
                    : 'Get your token from: https://mapbox.com/'
                  }
                </p>
              </div>

              {/* Map Component */}
              <div className="h-96 rounded-lg overflow-hidden shadow-elegant">
                {mapboxToken ? (
                  <Map mapboxToken={mapboxToken} />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-4" />
                      <p>{language === 'ka' ? 'რუკის ჩატვირთვა...' : 'Map will appear here'}</p>
                      <p className="text-sm mt-2">
                        {language === 'ka' 
                          ? 'Mapbox Token-ის შეყვანის შემდეგ'
                          : 'After entering Mapbox token above'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Location Description */}
              <Card className="mt-6 p-4">
                <CardContent className="p-0">
                  <h4 className="font-semibold mb-2">
                    {language === 'ka' ? 'როგორ მოვიდეთ ჩვენთან' : 'How to Find Us'}
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    {language === 'ka'
                      ? 'ჩვენი ოფისი მდებარეობს თბილისის ცენტრში, ხელმისაწვდომია საზოგადოებრივი ტრანსპორტით. დეტალური მიმართულებისთვის დაგვიკავშირდით.'
                      : 'Our office is located in central Tbilisi, accessible by public transport. Contact us for detailed directions.'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
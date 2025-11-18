import { Mail, Phone, MapPin, Facebook, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
  const { t, language } = useLanguage();

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
      value: '+995555121706',
      color: 'text-medical-green'
    },
    {
      icon: MapPin,
      label: language === 'ka' ? 'მისამართი' : 'Address',
      value: language === 'ka' ? 'ლუბლიანას ქ. 38ბ, თბილისი, საქართველო' : 'Lubliana St. 38b, Tbilisi, Georgia',
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
      <section className="relative bg-gradient-hero text-primary-foreground py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: 'url(/lovable-uploads/d9102eed-b6d7-4377-b46d-94339fab845f.png)' }}></div>
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
                          {info.icon === Phone ? (
                            <a 
                              href={`tel:${info.value}`}
                              className="text-muted-foreground hover:text-primary transition-colors"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="text-muted-foreground">{info.value}</p>
                          )}
                          {info.icon === MapPin && (
                            <a 
                              href="https://maps.google.com/?q=Lubliana+St.+38b,+Tbilisi,+Georgia"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 text-sm mt-1 inline-block transition-colors"
                            >
                              {language === 'ka' ? '🗺️ Google Maps-ზე ნახვა' : '🗺️ View on Google Maps'}
                            </a>
                          )}
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
                
                {/* Google Maps Embed */}
                <div className="mb-6">
                  <div className="h-96 rounded-lg overflow-hidden shadow-elegant">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2977.2086524932373!2d44.80008741540843!3d41.71531617923942!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40440d16aaa21b21%3A0x8f198f59b7d8b9c3!2sLubliana%20St%2038b%2C%20Tbilisi%2C%20Georgia!5e0!3m2!1sen!2sus!4v1640995200000!5m2!1sen!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="AvtoMed Location"
                    ></iframe>
                  </div>
                  
                  {/* Google Maps Link */}
                  <div className="mt-4 text-center">
                    <a 
                      href="https://maps.google.com/?q=Lubliana+St.+38b,+Tbilisi,+Georgia"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105"
                    >
                      <MapPin className="w-5 h-5" />
                      <span>{language === 'ka' ? 'Google Maps-ში გახსნა' : 'Open in Google Maps'}</span>
                    </a>
                  </div>
                </div>

                {/* Location Description */}
                <Card className="mt-6 p-4">
                  <CardContent className="p-0">
                    <h4 className="font-semibold mb-2">
                      {language === 'ka' ? 'როგორ მოხვიდეთ ჩვენთან' : 'How to Find Us'}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {language === 'ka'
                        ? 'ჩვენი ოფისი მდებარეობს ლუბლიანას ქუჩაზე 38ბ-ში. ადვილად მისაღწევია საზოგადოებრივი ტრანსპორტით და მანქანით.'
                        : 'Our office is located at Lubliana Street 38b in central Tbilisi. Easily accessible by public transport and car with nearby parking available.'
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
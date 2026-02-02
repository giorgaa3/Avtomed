import { Award, Users, Globe, Shield, Heart, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AboutUs = () => {
  const { t, language } = useLanguage();

  const stats = [
    {
      icon: Award,
      number: "10+",
      label: t('about.yearsExperience'),
      color: "text-medical-green"
    },
    {
      icon: Users,
      number: "500+",
      label: t('about.clientsServed'),
      color: "text-medical-blue"
    },
    {
      icon: Globe,
      number: "15+",
      label: t('about.countries'),
      color: "text-medical-red"
    },
    {
      icon: Shield,
      number: "100%",
      label: t('about.certified'),
      color: "text-primary"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: t('about.qualityTitle'),
      description: t('about.qualityDesc')
    },
    {
      icon: Shield,
      title: t('about.reliabilityTitle'),
      description: t('about.reliabilityDesc')
    },
    {
      icon: Users,
      title: t('about.serviceTitle'),
      description: t('about.serviceDesc')
    }
  ];

  const partners = [
    { name: "Altera (Meditera)", url: "https://www.meditera.com.tr/en" },
    { name: "Yilcal Medical" },
    { name: "Beybi" },
    { name: "TMS Medical" },
    { name: "Greetmed Medical" },
    { name: "Nubeno" },
    { name: "Hunkar Medical" },
    { name: "Biomedical" }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-primary-foreground py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: 'url(/lovable-uploads/a3a950e7-d676-4901-8bfe-01e863642249.png)' }}></div>
        <div className="absolute inset-0 bg-primary/20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl font-bold mb-6 font-display">
              {t('about.heroTitle')}
            </h1>
            <div className="text-6xl font-bold text-yellow-300 mb-4 animate-bounce-gentle">
              10+
            </div>
            <p className="text-2xl mb-8 font-display">
              {t('about.heroSubtitle')}
            </p>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed animate-fade-in">
              {t('about.heroDescription')}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group h-full">
                <div className="bg-card rounded-lg p-6 shadow-medical hover:shadow-elegant transition-all duration-300 hover:scale-105 h-full flex flex-col justify-center">
                  <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color} group-hover:animate-bounce-gentle`} />
                  <div className={`text-3xl font-bold mb-2 font-display ${language === 'ka' ? 'text-4xl' : ''}`}>{stat.number}</div>
                  <div className={`text-muted-foreground ${language === 'ka' ? 'text-lg' : ''}`}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 font-display animate-fade-in">
              {t('about.storyTitle')}
            </h2>
            
            <Card className="p-8 shadow-medical animate-scale-in">
              <CardContent className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed mb-6">
                  {t('about.companyStory')}
                </p>
                
                <div className="bg-primary/5 p-6 rounded-lg my-8">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Award className="w-6 h-6 mr-2 text-primary" />
                    {t('about.missionTitle')}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('about.mission')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 font-display animate-fade-in">
            {t('about.valuesTitle')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 text-center shadow-medical hover:shadow-elegant transition-all duration-300 hover:scale-105 animate-fade-in">
                <CardContent>
                  <value.icon className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 font-display animate-fade-in">
            {t('about.partnersTitle')}
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-center mb-8 text-muted-foreground">
              {t('about.partnersDescription')}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {partners.map((partner, index) => (
                partner.url ? (
                  <a 
                    key={index} 
                    href={partner.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-card p-4 rounded-lg text-center shadow-card hover:shadow-medical transition-all duration-300 hover:scale-105 animate-fade-in cursor-pointer"
                  >
                    <div className="font-medium text-sm">{partner.name}</div>
                  </a>
                ) : (
                  <div key={index} className="bg-card p-4 rounded-lg text-center shadow-card hover:shadow-medical transition-all duration-300 hover:scale-105 animate-fade-in">
                    <div className="font-medium text-sm">{partner.name}</div>
                  </div>
                )
              ))}
            </div>
            
            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-6">
                {t('about.certificationText')}
              </p>
              <div className="flex justify-center items-center gap-4 flex-wrap">
                <div className="bg-primary/10 px-4 py-2 rounded-full">
                  <span className="text-primary font-semibold">ISO 13485</span>
                </div>
                <div className="bg-medical-green/10 px-4 py-2 rounded-full">
                  <span className="text-medical-green font-semibold">FDA Certified</span>
                </div>
                <div className="bg-medical-blue/10 px-4 py-2 rounded-full">
                  <span className="text-medical-blue font-semibold">CE Marked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 font-display animate-fade-in">
            {t('about.ctaTitle')}
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto animate-fade-in">
            {t('about.ctaDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Button size="lg" variant="secondary" className="hover:scale-105 transition-transform">
              {t('about.contactButton')}
            </Button>
            <Button size="lg" variant="outline" className="border-white bg-white/10 text-white hover:bg-white hover:text-primary hover:scale-105 transition-all">
              {t('about.catalogueButton')}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
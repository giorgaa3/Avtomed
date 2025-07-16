import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/lovable-uploads/29063f06-8447-4719-96af-dddba4e78f67.png" 
                alt="AvtoMed Logo" 
                className="h-12 w-auto"
              />
              <div className="text-2xl font-bold">
                AvtoMed
              </div>
            </div>
            <p className="text-background/80 mb-4">
              Your trusted partner for certified medical equipment. Quality instruments 
              from verified sellers with full warranty support.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/anarmedgeorgia" target="_blank" rel="noopener noreferrer">
                <Facebook className="w-5 h-5 text-background/60 hover:text-background cursor-pointer" />
              </a>
              <Twitter className="w-5 h-5 text-background/60 hover:text-background cursor-pointer" />
              <Linkedin className="w-5 h-5 text-background/60 hover:text-background cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-background/80">
              <li><a href="#" className="hover:text-background transition-colors">Browse Equipment</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Sell Equipment</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Financing Options</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Warranty Info</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Support Center</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Popular Categories</h3>
            <ul className="space-y-2 text-background/80">
              <li><a href="#" className="hover:text-background transition-colors">Diagnostic Equipment</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Patient Monitoring</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Laboratory</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Imaging Equipment</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Surgical Instruments</a></li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3 text-background/80">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                <span>0322 53 03 03</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>avtandilzviadadze@yahho.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                <span>Lubliana St. 38b, Tbilisi, Georgia</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-2">Business Hours</h4>
              <div className="text-sm text-background/80">
                <div>Monday - Friday: 8:00 AM - 6:00 PM EST</div>
                <div>Saturday: Closed</div>
                <div>Sunday: Closed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-background/60 text-sm">
            © 2024 AvtoMed. All rights reserved. | ISO 13485 Certified | FDA Registered
          </div>
          <div className="flex gap-6 text-sm text-background/60 mt-4 md:mt-0">
            <a href="#" className="hover:text-background transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-background transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-background transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
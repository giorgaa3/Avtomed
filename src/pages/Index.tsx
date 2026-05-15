import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>AvtoMed – Trusted Medical Equipment Supplier in Georgia</title>
        <meta name="description" content="AvtoMed supplies hospitals and clinics in Georgia with certified medical equipment from leading global manufacturers. Browse diagnostic, surgical, and laboratory instruments." />
        <link rel="canonical" href="https://avtomed.ge/" />
        <meta property="og:title" content="AvtoMed – Trusted Medical Equipment Supplier in Georgia" />
        <meta property="og:description" content="Browse certified medical equipment from leading global manufacturers — diagnostic, surgical, and laboratory instruments." />
        <meta property="og:url" content="https://avtomed.ge/" />
      </Helmet>
      <Header />
      <main>
        <Hero />
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

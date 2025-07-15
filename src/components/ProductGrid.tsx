import { Heart, Eye, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Sample product data
const products = [
  {
    id: 1,
    name: "Digital Stethoscope Pro",
    brand: "CardioTech",
    price: 1299,
    originalPrice: 1599,
    condition: "New",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
    category: "Diagnostic",
    rating: 4.8,
    reviews: 124
  },
  {
    id: 2,
    name: "Portable Ultrasound Scanner",
    brand: "UltraSound Pro",
    price: 15999,
    condition: "Refurbished",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400",
    category: "Imaging",
    rating: 4.6,
    reviews: 89
  },
  {
    id: 3,
    name: "Surgical Instrument Set",
    brand: "SurgiPrecision",
    price: 899,
    condition: "New",
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400",
    category: "Surgical",
    rating: 4.9,
    reviews: 156
  },
  {
    id: 4,
    name: "Patient Monitor 12-Lead",
    brand: "VitalWatch",
    price: 8999,
    originalPrice: 12999,
    condition: "Used",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
    category: "Monitoring",
    rating: 4.5,
    reviews: 67
  },
  {
    id: 5,
    name: "Ventilator System Advanced",
    brand: "RespiCare",
    price: 25999,
    condition: "Refurbished",
    image: "https://images.unsplash.com/photo-1606153216591-5e7a9b4a5c8d?w=400",
    category: "Respiratory",
    rating: 4.7,
    reviews: 43
  },
  {
    id: 6,
    name: "Laboratory Centrifuge",
    brand: "LabTech Solutions",
    price: 3299,
    condition: "New",
    image: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400",
    category: "Laboratory",
    rating: 4.4,
    reviews: 78
  }
];

const getConditionBadge = (condition: string) => {
  switch (condition) {
    case "New":
      return <Badge className="bg-medical-green text-white">New</Badge>;
    case "Refurbished":
      return <Badge className="bg-primary text-white">Refurbished</Badge>;
    case "Used":
      return <Badge variant="outline">Used</Badge>;
    default:
      return <Badge variant="outline">{condition}</Badge>;
  }
};

const ProductGrid = () => {
  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Featured Medical Equipment
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover high-quality medical instruments from trusted sellers. All equipment is 
            certified, tested, and comes with warranty protection.
          </p>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="group hover:shadow-medical transition-all duration-300 bg-gradient-card border-0">
              <CardContent className="p-0">
                {/* Product image */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Condition badge */}
                  <div className="absolute top-3 left-3">
                    {getConditionBadge(product.condition)}
                  </div>
                  {/* Discount badge */}
                  {product.originalPrice && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-medical-red text-white">
                        Save ${product.originalPrice - product.price}
                      </Badge>
                    </div>
                  )}
                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Product details */}
                <div className="p-6">
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs">{product.category}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{product.brand}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-500">
                      {"★".repeat(Math.floor(product.rating))}
                      {"☆".repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        ${product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          ${product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-gradient-hero">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="sm">
                      Contact Seller
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View more */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="px-8">
            View All Equipment
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
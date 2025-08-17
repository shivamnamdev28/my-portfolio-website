import { Card, CardContent } from "@/components/ui/card";

const IndustriesServed = () => {
  const industries = [
    "Real Estate", "Education", "Hospitality", "Healthcare", 
    "Government", "Politics", "Events", "Wedding", "Restaurant",
    "Jewellery", "Entertainment", "Corporate", "Travel", "Technology",
    "Fashion", "Automotive", "Banking", "Non-Profit"
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Industries <span className="text-primary">Served</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            10+ years of cross-industry expertise delivering exceptional results across diverse sectors
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 max-w-6xl mx-auto">
          {industries.map((industry, index) => (
            <Card 
              key={index}
              className="glass-card hover:border-primary/30 transition-all duration-300 group"
            >
              <CardContent className="p-4 text-center">
                <span className="text-sm font-medium group-hover:text-primary transition-colors">
                  {industry}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center glass-card p-6">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Projects Completed</div>
          </div>
          <div className="text-center glass-card p-6">
            <div className="text-3xl font-bold text-primary mb-2">18+</div>
            <div className="text-sm text-muted-foreground">Industries Served</div>
          </div>
          <div className="text-center glass-card p-6">
            <div className="text-3xl font-bold text-primary mb-2">11+</div>
            <div className="text-sm text-muted-foreground">Years Experience</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustriesServed;
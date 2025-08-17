import { 
  Palette, 
  Video, 
  Sparkles, 
  Globe, 
  Camera, 
  Megaphone, 
  Smartphone, 
  Building,
  Heart,
  Users,
  BarChart3,
  Wand2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Services = () => {
  const services = [
    {
      icon: Palette,
      title: "Logo & Brand Design",
      description: "Complete brand identity development, logo design, and visual guidelines for lasting brand impact."
    },
    {
      icon: Video,
      title: "Video Production",
      description: "From concept to completion - promotional videos, wedding films, corporate content, and web series."
    },
    {
      icon: Sparkles,
      title: "Motion Graphics & VFX",
      description: "Stunning motion graphics, visual effects, and animated content that captivates audiences."
    },
    {
      icon: Globe,
      title: "Website & App Design",
      description: "WordPress websites, UI/UX design for web and mobile applications with modern aesthetics."
    },
    {
      icon: Megaphone,
      title: "Meta Ads Campaign",
      description: "Strategic Meta Ads management for Facebook and Instagram to maximize reach and conversions."
    },
    {
      icon: BarChart3,
      title: "End to End Marketing Strategy",
      description: "Complete marketing solutions from strategy development to execution across all channels."
    },
    {
      icon: Building,
      title: "Google Listing Management",
      description: "Complete Google Business Profile optimization and local SEO for enhanced online visibility."
    },
    {
      icon: Smartphone,
      title: "Social Media Strategy",
      description: "Content creation and social media strategy for brand growth across all platforms."
    },
    {
      icon: Camera,
      title: "Political Campaigns",
      description: "Comprehensive campaign design and marketing for Mayor, MLA, MP candidates across parties."
    },
    {
      icon: Building,
      title: "Real Estate Marketing",
      description: "Property branding, virtual tours, and complete marketing solutions for real estate projects."
    },
    {
      icon: Users,
      title: "Event Branding",
      description: "Complete event branding from concept to execution, including national-level festivals."
    },
    {
      icon: Heart,
      title: "Print & Digital Media",
      description: "Brochures, banners, magazines, and all printable graphic design with professional quality."
    },
    {
      icon: Wand2,
      title: "AI-Powered Content",
      description: "Leveraging cutting-edge AI tools for enhanced creative workflows and innovative content."
    }
  ];

  const additionalServices = [
    "Event Photography Management",
    "Wedding Photography Management", 
    "Co Direction of Short Films and Web Series",
    "Online Travel Channel Integration",
    "Rapid Content Creation (45+ in 1 day)",
    "Cross-Industry Expertise"
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Services <span className="text-primary">Offered</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive creative solutions spanning design, video, digital marketing, and strategic consulting
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="glass-card hover:border-primary/30 transition-all duration-300 group h-full"
            >
              <CardHeader className="pb-4">
                <service.icon className="h-12 w-12 text-primary mb-4 group-hover:scale-110 transition-transform duration-300" />
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Services */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 text-primary">
            Additional Expertise
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {additionalServices.map((service, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 p-4 glass-card hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                <span className="text-sm font-medium">{service}</span>
              </div>
            ))}
          </div>
        </div>


        {/* Process Highlight */}
        <div className="mt-16 glass-card p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-6 text-primary">
            My Creative Process
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Understand</h4>
              <p className="text-sm text-muted-foreground">Deep dive into your brand, goals, and audience</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Strategize</h4>
              <p className="text-sm text-muted-foreground">Develop creative strategy aligned with objectives</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Create</h4>
              <p className="text-sm text-muted-foreground">Execute with precision using latest tools and techniques</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">4</span>
              </div>
              <h4 className="font-semibold mb-2">Deliver</h4>
              <p className="text-sm text-muted-foreground">Ensure impact and measure results</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
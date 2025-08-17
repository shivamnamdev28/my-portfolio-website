import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Shivam Namdev
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-light mb-8 text-muted-foreground">
            Creative Director | Visual Strategist | AI-Powered Content Creator
          </h2>
          
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-muted-foreground leading-relaxed">
            <span className="text-primary font-semibold">10+ years</span> of transforming ideas into compelling visual stories. 
            From political campaigns to wedding films, real estate branding to educational content — 
            I deliver complete creative solutions that drive results.
          </p>
          
          <div className="space-y-4 mb-12">
            <p className="text-xl font-medium text-primary">
              "Design. Strategy. Storytelling. Delivered."
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="gold-gradient text-gold-foreground hover:scale-105 transition-transform duration-300">
              View My Work
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button size="lg" variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/10">
              <Play className="mr-2 h-5 w-5" />
              Watch Showreel
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">45+</div>
              <div className="text-sm text-muted-foreground">Creatives in 1 Day</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">11+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">15+</div>
              <div className="text-sm text-muted-foreground">Industries Served</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-1 h-16 bg-gradient-to-b from-primary to-transparent rounded-full"></div>
      </div>
    </section>
  );
};

export default Hero;
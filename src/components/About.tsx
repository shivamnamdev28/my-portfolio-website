import { Calendar, Award, Users, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const highlights = [
    {
      icon: Calendar,
      title: "Since 2014",
      description: "Creative professional with cross-industry expertise"
    },
    {
      icon: Award,
      title: "Event Leadership",
      description: "Headed departments in national-level events and festivals"
    },
    {
      icon: Users,
      title: "Team Direction",
      description: "Led creative teams for web series, short films, and campaigns"
    },
    {
      icon: Sparkles,
      title: "AI Integration",
      description: "Early adopter of AI tools in creative workflow"
    }
  ];

  const majorProjects = [
    "Ram-Rajya (Web Series - Director/Editor)",
    "Das Din Ka Anshan (Short Film - Co-Director)",
    "Sade Sati (Short Film - Editor)",
    "Crime Literature Fest (Creative Head)",
    "Ram Run / Global Ram Run (Branding Lead)",
    "40s and Beyond Club Carnival (Creative Director)",
    "Pari Bazar Campaign (Multiple creative deliverables)"
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-primary">Shivam</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A versatile creative professional who transforms concepts into compelling visual narratives 
              across multiple industries, leveraging both traditional expertise and cutting-edge AI tools.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {highlights.map((item, index) => (
              <Card key={index} className="glass-card hover:border-primary/30 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <item.icon className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Story */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-primary">The Creative Journey</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Since 2014, I've been crafting visual stories that resonate. My journey began with traditional design, 
                  evolved through film direction and editing, and now embraces AI-powered creative workflows.
                </p>
                <p>
                  From creating <span className="text-primary font-semibold">800+ projects, 250+ logos, 5000+ social media posts, and 1100+ videos</span> 
                  to directing web series and managing national-level event branding, 
                  I've consistently delivered under pressure while maintaining creative excellence.
                </p>
                <p>
                  My expertise spans <span className="text-primary font-semibold">real estate, education, hospitality, 
                  healthcare, government, politics, and events</span> — making me a one-stop creative solution 
                  for diverse client needs.
                </p>
              </div>
            </div>

            {/* Major Projects */}
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-6 text-primary">Notable Projects & Achievements</h3>
              <div className="space-y-3">
                {majorProjects.map((project, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">{project}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-primary font-medium">
                  💡 Innovation Highlight: Successfully integrated online travel platforms 
                  (Booking.com, MakeMyTrip, Goibibo, Agoda) for hotel client 
                  <span className="font-semibold"> Shri Kailash Mansarovar, Sagar</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
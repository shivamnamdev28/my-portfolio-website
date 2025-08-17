import { Badge } from "@/components/ui/badge";

const Tools = () => {
  const toolCategories = [
    {
      category: "Adobe Creative Suite",
      color: "bg-red-500/10 text-red-400 border-red-500/20",
      tools: [
        "Adobe Photoshop",
        "Adobe Illustrator", 
        "Adobe Premiere Pro",
        "Adobe After Effects",
        "Adobe InDesign",
        "Adobe XD",
        "Adobe Firefly"
      ]
    },
    {
      category: "AI-Powered Tools",
      color: "bg-primary/10 text-primary border-primary/20",
      tools: [
        "ChatGPT",
        "Google Gemini",
        "MidJourney",
        "Runway ML",
        "Flow by Luma",
        "Luma Dream Machine",
        "Kling AI",
        "Google Veo",
        "Google Whisk",
        "DeepSeek"
      ]
    },
    {
      category: "Web & UI Design",
      color: "bg-green-500/10 text-green-400 border-green-500/20",
      tools: [
        "WordPress",
        "Adobe XD"
      ]
    },
    {
      category: "Social Media & Marketing",
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      tools: [
        "Meta Ads Manager",
        "Google Ads",
        "LinkedIn Ads"
      ]
    }
  ];

  const workflowHighlights = [
    {
      title: "AI-Enhanced Creativity",
      description: "Leveraging AI tools for concept generation, content creation, and workflow optimization"
    },
    {
      title: "Cross-Platform Integration",
      description: "Seamless integration across design, video, and marketing platforms for efficient delivery"
    },
    {
      title: "Rapid Prototyping",
      description: "Quick iteration and client feedback integration using modern design and collaboration tools"
    },
    {
      title: "Data-Driven Design",
      description: "Analytics-informed creative decisions using social media insights and performance metrics"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Tools & <span className="text-primary">Technologies</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Equipped with industry-leading software and cutting-edge AI tools to deliver exceptional creative solutions
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {toolCategories.map((category, index) => (
            <div 
              key={index}
              className="glass-card p-6 hover:border-primary/30 transition-all duration-300"
            >
              <h3 className="text-xl font-bold mb-4 text-primary">
                {category.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.tools.map((tool, toolIndex) => (
                  <Badge 
                    key={toolIndex} 
                    variant="outline"
                    className={`${category.color} hover:scale-105 transition-transform duration-200`}
                  >
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Workflow Highlights */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-primary">
            Technology-Enhanced Workflow
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowHighlights.map((item, index) => (
              <div 
                key={index}
                className="text-center p-6 glass-card hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 transition-colors duration-300">
                  <span className="text-2xl font-bold text-primary">{index + 1}</span>
                </div>
                <h4 className="font-bold text-lg mb-3 group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Integration Callout */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="glass-card p-8 border-primary/30">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-primary">
                🚀 AI-Powered Creative Excellence
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                As an early adopter of AI tools, I integrate artificial intelligence into every aspect of the creative process - 
                from concept generation and content creation to workflow optimization and client communication.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <strong className="text-primary">Content Generation:</strong><br />
                  AI-assisted copywriting, image generation, and video creation
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <strong className="text-primary">Design Enhancement:</strong><br />
                  AI-powered design suggestions, color palette optimization
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <strong className="text-primary">Workflow Optimization:</strong><br />
                  Automated tasks, intelligent asset management, rapid prototyping
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tools;
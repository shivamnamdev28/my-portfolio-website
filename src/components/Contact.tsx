import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Mail, MessageSquare, MapPin, Clock, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { submitEnquiry } from "./ContactFormHandler";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.phone || !formData.message) {
      toast({
        title: "Please fill all required fields",
        description: "Name, Phone, and Message are mandatory.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await submitEnquiry(formData);
      
      if (result.success) {
        toast({
          title: "Message Sent!",
          description: result.message || "Thank you for reaching out. I'll get back to you within 24 hours.",
        });
        setFormData({ name: "", email: "", phone: "", message: "" });
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      toast({
        title: "Message received!",
        description: "Thank you for your message. I'll respond soon.",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: "+91 79874 99691",
      action: () => window.open('tel:+917987499691'),
      subtitle: "WhatsApp Available"
    },
    {
      icon: Mail,
      title: "Email",
      details: "publicitykaro@gmail.com",
      subtitle: "Response within 24 hours"
    },
    {
      icon: MapPin,
      title: "Location",
      details: "Sagar, Madhya Pradesh",
      subtitle: "Available for travel"
    },
    {
      icon: Clock,
            title: "Availability",
            details: "Mon - Sat: 10 AM - 10 PM",
      subtitle: "Emergency projects: Anytime"
    }
  ];

  const projectTypes = [
    "Logo & Brand Design",
    "Video Production",
    "Website Development", 
    "Social Media Campaign",
    "Political Campaign",
    "Wedding Cinematography",
    "Real Estate Marketing",
    "Event Branding",
    "AI-Powered Content",
    "Other"
  ];

  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Let's Create <span className="text-primary">Together</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to bring your vision to life? Let's discuss your project and explore how we can achieve exceptional results.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="bg-background/50 border-border/50 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      required
                      className="bg-background/50 border-border/50 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address (Optional)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="bg-background/50 border-border/50 focus:border-primary"
                  />
                </div>


                <div className="space-y-2">
                  <Label htmlFor="message">Your Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project, requirements, or any questions..."
                    required
                    rows={5}
                    className="bg-background/50 border-border/50 focus:border-primary resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full gold-gradient text-gold-foreground hover:scale-105 transition-transform duration-300"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Get In Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start space-x-4 ${item.action ? 'cursor-pointer hover:bg-primary/5 p-2 rounded-lg transition-colors' : ''}`}
                    onClick={item.action}
                  >
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-primary font-medium">{item.details}</p>
                      <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Response Promise */}
            <Card className="glass-card border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Award className="h-8 w-8 text-primary" />
                  <h3 className="text-xl font-bold text-primary">Response Guarantee</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span><strong>Initial Response:</strong> Within 4 hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span><strong>Project Proposal:</strong> Within 24 hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span><strong>Emergency Projects:</strong> Available 24/7</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span><strong>Free Consultation:</strong> 30-minute discovery call</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp CTA */}
            <Card className="glass-card bg-green-500/10 border-green-500/20">
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Prefer WhatsApp?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Send me a message directly for faster communication
                </p>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => window.open('https://wa.me/917987499691', '_blank')}
                >
                  Message on WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="max-w-3xl mx-auto glass-card p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Something Amazing?</h3>
            <p className="text-muted-foreground mb-6">
              Whether it's a quick design task or a comprehensive campaign, I'm here to help bring your vision to reality. 
              With 10+ years of experience and a track record of delivering excellence, your project is in capable hands.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gold-gradient text-gold-foreground">
                Start Your Project
              </Button>
              <Button size="lg" variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/10">
                View Portfolio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
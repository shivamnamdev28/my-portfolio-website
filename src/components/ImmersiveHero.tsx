import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ParallaxBackground } from './ParallaxBackground';
import { useInView } from 'react-intersection-observer';
import { supabase } from '@/lib/supabase';

const ImmersiveHero = () => {
  const [stage, setStage] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const { ref, inView } = useInView({ threshold: 0.1 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setStage(3); // Show all content immediately with small animation
  }, []);

  const scale = Math.max(0.3, 1 - scrollY * 0.002);
  const opacity = Math.max(0, 1 - scrollY * 0.003);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      <ParallaxBackground />
      
      <motion.div 
        className="relative z-10 min-h-screen flex items-center justify-center"
        style={{ 
          scale,
          opacity,
          transform: `translateY(${scrollY * 0.5}px) scale(${scale})`
        }}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <motion.h1 
              className="text-6xl md:text-9xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              Shivam Namdev
            </motion.h1>
            
            <motion.h2 
              className="text-2xl md:text-4xl font-light text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Creative Professional | Visual Strategist | AI-Powered Creator
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <motion.p 
              className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <span className="text-primary font-semibold">10+ years</span> of transforming ideas into compelling visual stories. 
              From political campaigns to wedding films, real estate branding to educational content.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-purple-600 hover:to-primary text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => {
                  const portfolioSection = document.getElementById('portfolio');
                  portfolioSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Explore My Work
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button 
                size="lg" 
                variant="secondary"
            className="bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                onClick={async () => {
                  try {
                    // For now, use static resume until types are updated
                    const link = document.createElement('a');
                    link.href = '/resume-shivam-namdev.pdf';
                    link.download = 'Shivam-Namdev-Resume.pdf';
                    link.click();
                  } catch (error) {
                    // Fallback to static resume if database fails
                    const link = document.createElement('a');
                    link.href = '/resume-shivam-namdev.pdf';
                    link.download = 'Shivam-Namdev-Resume.pdf';
                    link.click();
                  }
                }}
              >
                <Download className="mr-2 h-5 w-5" />
                Download Resume
              </Button>
            </motion.div>

            <motion.div 
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              {[
                { number: "10+", label: "Years Experience" },
                { number: "800+", label: "Projects Completed" },
                { number: "250+", label: "Logos Created" },
                { number: "5000+", label: "Social Media Posts" },
                { number: "1100+", label: "Videos Produced" },
                { number: "18+", label: "Industries Served" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center backdrop-blur-sm bg-white/5 p-4 rounded-lg border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ opacity }}
      >
        <div className="w-1 h-16 bg-gradient-to-b from-primary to-transparent rounded-full"></div>
      </motion.div>
    </section>
  );
};

export default ImmersiveHero;
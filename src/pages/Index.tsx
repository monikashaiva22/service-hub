import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Shield, Clock, Wrench, ChevronRight, Star } from 'lucide-react';
import { getServices } from '@/lib/store';
import Navbar from '@/components/Navbar';

const Index = () => {
  const { user } = useAuth();
  const services = getServices();

  const features = [
    { icon: Clock, title: 'Easy Scheduling', desc: 'Book your preferred time slot in seconds' },
    { icon: Shield, title: 'Trusted Service', desc: 'Certified mechanics you can rely on' },
    { icon: Wrench, title: 'Full Range', desc: 'From oil changes to major repairs' },
    { icon: Star, title: 'Track Progress', desc: 'Real-time updates on your service status' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="gradient-hero py-24 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-primary-foreground mb-6 leading-tight">
              Your Vehicle Deserves<br />The Best Care
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Book professional vehicle services online. Fast, reliable, and transparent pricing.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              {user ? (
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>
                  <Button size="lg" variant="secondary" className="font-semibold">
                    Go to Dashboard <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" variant="secondary" className="font-semibold">
                      Get Started <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="ghost" className="text-primary-foreground border border-primary-foreground/30 hover:bg-primary-foreground/10">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Why Choose AutoCare Pro?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <Card key={f.title} className="glass-card text-center hover:shadow-xl transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="w-14 h-14 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-4">
                    <f.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Our Services</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(s => (
              <Card key={s.id} className="glass-card hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-heading font-bold text-lg">{s.serviceName}</h3>
                    <span className="text-xl font-bold text-primary">${s.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{s.description}</p>
                  <p className="text-xs text-muted-foreground">⏱ {s.duration}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Car className="w-5 h-5 text-primary" />
            <span className="font-heading font-bold">AutoCare Pro</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 AutoCare Pro. Vehicle Service Booking System.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

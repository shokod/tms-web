// export default function SettingsPage() {
//   return (
//     <div className="space-y-4">
//       <h1 className="text-2xl font-bold">Settings</h1>
//       <p>Manage your preferences</p>
//     </div>
//   );
// }
"use client"
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Star } from 'lucide-react';

// Header Component
function Header() {
  return (
    <header className="bg-white sticky top-0 z-50 border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-orange-500">Aurum Safety</div>
        <nav className="flex gap-10">
          {['Home', 'Services', 'About Us', 'Testimonials', 'FAQ'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-gray-700 hover:text-orange-500 font-medium transition-colors text-base">
              {item}
            </a>
          ))}
        </nav>
        <Button className="bg-slate-700 hover:bg-slate-800 rounded-full px-8 text-base">
          CONTACT US →
        </Button>
      </div>
    </header>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 px-8 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 opacity-40">
        <img 
          src="https://images.unsplash.com/photo-1682142162574-b304bacbdc3f?w=1920&h=1080&fit=crop" 
          alt="Mining operations" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90"></div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white mb-6 px-6 py-2 text-sm shadow-lg">
          South African Excellence, Global Standards
        </Badge>
        <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
          Safe Mining Operations,<br />Exceptional Results
        </h1>
        <p className="text-xl text-gray-200 mb-10 max-w-4xl mx-auto leading-relaxed">
          Empowering Gold Mining Operations with Expert Risk Management,<br />
          Safety Consulting, and Compliance Solutions
        </p>
        <div className="flex gap-6 justify-center">
          <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-full px-10 py-6 text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all">
            Request Consultation →
          </Button>
          <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-slate-800 rounded-full px-10 py-6 text-lg backdrop-blur-sm">
            Get a Free Safety Audit →
          </Button>
        </div>
      </div>
    </section>
  );
}

// Feature Card
function FeatureCard({ icon, title, description, highlight, imageGradient }) {
  return (
    <Card className={`transition-all hover:-translate-y-2 hover:shadow-2xl ${highlight ? 'bg-gradient-to-br from-slate-700 to-slate-800 text-white' : 'bg-gray-50'}`}>
      <CardContent className="p-8 text-center">
        {imageGradient ? (
          <div className="w-full h-40 rounded-lg mb-6 flex items-center justify-center text-6xl" style={{ background: imageGradient }}>
            {icon}
          </div>
        ) : (
          <div className={`w-24 h-24 rounded-lg mx-auto mb-6 flex items-center justify-center text-5xl bg-orange-500`}>
            {icon}
          </div>
        )}
        <h3 className={`text-2xl font-bold mb-3 ${highlight ? 'text-white' : 'text-slate-800'}`}>{title}</h3>
        <p className={`text-base ${highlight ? 'text-gray-200' : 'text-gray-600'}`}>{description}</p>
      </CardContent>
    </Card>
  );
}

// Features Section
function FeaturesSection() {
  const features = [
    { icon: '⚡', title: 'Expert Support', description: '24/7 access to certified safety professionals and risk management experts' },
    { icon: '🎯', title: 'Compliance Focus', description: 'Comprehensive solutions for MHSA, OHSA, and international mining standards' },
    { icon: '⚒️', title: 'Industry Specialized', description: 'Dedicated exclusively to gold mining operations and precious metals extraction', highlight: true, imageGradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' },
    { icon: '🔬', title: 'Advanced Analysis', description: 'Cutting-edge risk assessment and hazard identification systems', imageGradient: 'linear-gradient(135deg, #666 0%, #999 100%)' }
  ];

  return (
    <section className="py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <Badge className="bg-gradient-to-r from-slate-700 to-slate-600 text-white mb-6 px-6 py-2 text-sm">Our Expertise</Badge>
        <h2 className="text-5xl font-bold text-slate-800 mb-16">Why Choose Aurum Safety Solutions?</h2>
        <div className="grid grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
        <Alert className="bg-gray-50 border-l-4 border-orange-500 p-8">
          <AlertDescription className="text-xl leading-relaxed text-gray-700">
            With over 15 years of experience, Aurum Safety Solutions is dedicated to revolutionizing gold mining safety practices. We partner with mining operations across Africa and internationally to adopt innovative risk management techniques, reduce incidents, and promote sustainable safety ecosystems. Our mission is to safeguard your workforce with expertise for a safer tomorrow.
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
}

// Service Card
function ServiceCard({ icon, badge, title, description, gradient, index }) {
  return (
    <Card className="relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group">
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity duration-500" style={{ background: gradient, clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>
      
      <CardContent className="p-8 relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <Badge className="bg-slate-100 text-slate-700 hover:bg-orange-500 hover:text-white transition-colors uppercase text-xs font-bold tracking-wider px-3 py-1 group-hover:scale-105 duration-300">
            {badge}
          </Badge>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed text-base">
            {description}
          </p>
          
          <div className="pt-4 flex items-center text-orange-600 font-semibold group-hover:gap-3 gap-2 transition-all cursor-pointer">
            <span>Learn More</span>
            <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
          </div>
        </div>
      </CardContent>
      
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600 w-0 group-hover:w-full transition-all duration-500"></div>
    </Card>
  );
}

// Services Section
function ServicesSection() {
  const services = [
    { icon: '⛏️', badge: 'Safety First', title: 'Safety Management Systems', description: 'Develop comprehensive safety frameworks tailored to your operations with industry-leading methodologies', gradient: 'linear-gradient(135deg, #444 0%, #666 100%)' },
    { icon: '📋', badge: 'Compliance', title: 'Risk Assessment & Consulting', description: 'Expert evaluation and mitigation strategies for mining hazards with actionable insights', gradient: 'linear-gradient(135deg, #555 0%, #777 100%)' },
    { icon: '📱', badge: 'Technology', title: 'Safety Training & Certification', description: 'Accredited programs for all levels of mining personnel with hands-on experience', gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' },
    { icon: '🛡️', badge: 'Protection', title: 'Emergency Response Planning', description: 'Comprehensive crisis management and evacuation protocols for all scenarios', gradient: 'linear-gradient(135deg, #666 0%, #888 100%)' }
  ];

  return (
    <section className="relative py-24 px-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-orange-50/30 to-slate-50"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-slate-700 to-slate-600 text-white mb-6 px-6 py-2 text-sm">
            Our Services
          </Badge>
          <h2 className="text-5xl font-bold text-slate-800 mb-4">
            What We Offer
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive safety solutions designed specifically for the unique challenges of gold mining operations
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-8 mb-12">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} index={index} />
          ))}
        </div>
        
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-12 text-center shadow-2xl">
          <h3 className="text-3xl font-bold text-white mb-4">
            Need a Custom Solution?
          </h3>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Every mining operation is unique. Let's discuss how we can tailor our services to meet your specific safety requirements.
          </p>
          <div className="flex gap-6 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-10 py-6 text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all">
              View All Services →
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white hover:bg-white hover:text-slate-800 rounded-full px-10 py-6 text-lg transition-all">
              Schedule Consultation →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// Testimonial Card
function TestimonialCard({ rating, text, name, role, initials }) {
  return (
    <Card className="bg-gray-50 transition-all hover:-translate-y-2 hover:shadow-2xl">
      <CardContent className="p-8">
        <div className="flex items-center gap-2 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-6 h-6 fill-orange-500 text-orange-500" />
          ))}
          <span className="ml-2 font-semibold text-gray-700 text-lg">{rating.toFixed(1)}</span>
        </div>
        <p className="text-gray-700 mb-8 leading-relaxed text-base">{text}</p>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg">{initials}</div>
          <div>
            <div className="font-bold text-gray-900 text-lg">{name}</div>
            <div className="text-sm text-gray-600">{role}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    { rating: 5.0, text: "The risk analysis service transformed our team's safety culture. Incidents reduced by 70% within six months of implementation.", name: "Thabo Mthembu", role: "Operations Manager", initials: "TM" },
    { rating: 5.0, text: "Switched to Aurum Safety Solutions—saved 40% on compliance costs while achieving exceptional safety ratings across all sites.", name: "Sarah Fourie", role: "Safety Director", initials: "SF" },
    { rating: 5.0, text: "Outstanding consulting made compliance easy. Staff proficiency improved significantly, productivity increased by 35%.", name: "Kwame Nkosi", role: "Mine Supervisor", initials: "KN" }
  ];

  return (
    <section className="py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <Badge className="bg-gradient-to-r from-slate-700 to-slate-600 text-white mb-6 px-6 py-2 text-sm">Testimonials</Badge>
        <h2 className="text-5xl font-bold text-slate-800 mb-16">What Mining Operators Say</h2>
        <div className="grid grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  
  const faqs = [
    { question: "What makes your safety solutions effective for gold mining?", answer: "Our solutions are specifically designed for gold mining operations, incorporating industry-specific hazards, compliance requirements, and best practices developed over 15 years of specialized experience." },
    { question: "Do you offer services for small-scale mining operations?", answer: "Yes, we provide scalable solutions tailored to operations of all sizes, from artisanal miners to large-scale industrial operations." },
    { question: "How does your risk assessment process work?", answer: "Our comprehensive risk assessment includes site inspection, hazard identification, risk evaluation, mitigation strategy development, and ongoing monitoring." },
    { question: "Can you help with MHSA and international compliance?", answer: "Absolutely. We specialize in South African MHSA compliance and are well-versed in international mining standards." },
    { question: "What if we need emergency safety support?", answer: "We offer 24/7 emergency support services with rapid response teams available to assist with critical safety incidents." }
  ];

  return (
    <section className="bg-gray-50 py-20 px-8">
      <div className="max-w-5xl mx-auto">
        <Badge className="bg-gradient-to-r from-slate-700 to-slate-600 text-white mb-6 px-6 py-2 text-sm">Support</Badge>
        <h2 className="text-5xl font-bold text-slate-800 mb-16">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg border-l-4 border-transparent hover:border-orange-500 transition-all shadow-sm">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 text-left font-semibold text-gray-900 hover:text-orange-500 flex justify-between items-center text-lg"
              >
                <span>{faq.question}</span>
                <span className="text-3xl transition-transform duration-200" style={{ transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
              </button>
              {openIndex === index && (
                <div className="px-8 pb-6 text-gray-600 leading-relaxed text-base">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className="relative py-24 px-8 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="relative z-10 max-w-5xl mx-auto">
        <h2 className="text-6xl font-bold text-white mb-12 leading-tight">Ready to Transform Your<br />Mining Safety Practices?</h2>
        <div className="flex gap-6 justify-center">
          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-10 py-6 text-lg shadow-lg">Book Free Safety Audit →</Button>
          <Button size="lg" variant="outline" className="border-2 border-orange-500 text-orange-500 bg-transparent hover:bg-orange-500 hover:text-white rounded-full px-10 py-6 text-lg">Get In Touch →</Button>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  const footerSections = [
    { title: 'Company', links: ['About Us', 'Careers', 'Contact', 'News'] },
    { title: 'Services', links: ['Risk Management', 'Safety Training', 'Compliance', 'Consulting'] },
    { title: 'Resources', links: ['White Papers', 'Case Studies', 'Safety Guides', 'MHSA Updates'] },
    { title: 'Contact', links: ['Johannesburg, South Africa', 'info@aurumsafety.co.za', '+27 11 XXX XXXX'] }
  ];

  return (
    <footer className="bg-slate-800 text-white py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-4xl font-bold text-orange-500 mb-12">
          Aurum Safety
          <div className="text-lg font-normal text-white mt-2">Solutions</div>
        </div>
        <div className="grid grid-cols-4 gap-12 mb-16">
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-orange-500 font-bold mb-6 text-lg">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}><a href="#" className="text-gray-300 hover:text-orange-500 transition-colors text-base">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-8 border-t border-gray-700 text-center text-gray-400">
          <p className="text-base">© 2025 Aurum Safety Solutions. South African Company Registration: XXXX/XXXXXX/XX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// Main Page Component
export default function MiningConsultancyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ServicesSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
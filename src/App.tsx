import React, { useState, useEffect } from 'react';
import { Crown, Smartphone, Bike, UtensilsCrossed, Shield, ChevronRight, Star, Users, Package, Zap, MapPin, Globe, ArrowRight } from 'lucide-react';
import { SplashScreen, OnboardingScreen, AuthScreen, LocationScreen } from './components/customer/Onboarding';
import { CustomerApp } from './components/customer/CustomerApp';
import { DriverApp } from './components/driver/DriverApp';
import { RestaurantPortal } from './components/restaurant/RestaurantPortal';
import { AdminPanel } from './components/admin/AdminPanel';

type AppView = 'landing' | 'customer-splash' | 'customer-onboarding' | 'customer-auth' | 'customer-location' | 'customer-app' | 'driver' | 'restaurant' | 'admin';

// ─── Platform Landing Page ────────────────────────────────────────────────────
const LandingPage: React.FC<{ onSelect: (view: AppView) => void }> = ({ onSelect }) => {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div className="min-h-screen bg-empire-black overflow-auto">
      {/* Hero */}
      <div className="relative min-h-screen flex flex-col">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold-500/4 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-500/3 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-gold-500/5 rounded-full blur-2xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gold-500/20 rounded-2xl blur-md" />
              <div className="relative w-10 h-10 bg-gold-500 rounded-2xl flex items-center justify-center shadow-gold">
                <Crown className="w-6 h-6 text-empire-black" strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <p className="font-black text-white text-lg tracking-tight leading-none">EMPIRE</p>
              <p className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase">Deliveries</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-white/60 text-sm font-medium">
            {['Platform', 'Features', 'Cities', 'Pricing'].map(item => (
              <a key={item} href="#" className="hover:text-white transition-colors">{item}</a>
            ))}
          </div>
          <button onClick={() => onSelect('customer-splash')} className="hidden md:flex items-center gap-2 bg-gold-500 text-empire-black font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-gold-400 transition-colors">
            Order Now <ArrowRight className="w-4 h-4" />
          </button>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
          <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-empire-success rounded-full animate-pulse" />
            <span className="text-gold-400 text-xs font-semibold tracking-wide">Now serving 15+ South African cities</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-6 animate-slide-up">
            South Africa's
            <br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #D4AF37 0%, #F5D876 50%, #D4AF37 100%)' }}>
              Royal Delivery
            </span>
            <br />
            Platform
          </h1>

          <p className="text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed mb-10 animate-fade-in">
            Food, groceries, pharmacy, and courier — all in one premium app. Built for South Africans, by South Africans.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-slide-up">
            <button onClick={() => onSelect('customer-splash')} className="flex items-center justify-center gap-2 bg-gold-500 text-empire-black font-bold text-base px-8 py-4 rounded-2xl hover:bg-gold-400 transition-all shadow-gold-lg hover:shadow-gold hover:-translate-y-0.5">
              <Smartphone className="w-5 h-5" />
              Open Customer App
            </button>
            <button onClick={() => onSelect('driver')} className="flex items-center justify-center gap-2 border border-white/20 text-white font-semibold text-base px-8 py-4 rounded-2xl hover:bg-white/5 transition-all">
              <Bike className="w-5 h-5" />
              Drive with Empire
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 animate-fade-in">
            {[{ value: '284K+', label: 'Happy Customers' }, { value: '1,200+', label: 'Active Drivers' }, { value: '500+', label: 'Restaurants' }, { value: '15', label: 'SA Cities' }].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-black text-white">{s.value}</p>
                <p className="text-white/40 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 flex justify-center pb-8 animate-bounce-subtle">
          <div className="w-8 h-12 border-2 border-white/20 rounded-full flex items-start justify-center pt-2">
            <div className="w-1 h-3 bg-gold-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* Platform Selector */}
      <div className="relative z-10 px-6 lg:px-12 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-gold-500 text-sm font-bold uppercase tracking-widest mb-3">The Empire Ecosystem</p>
            <h2 className="text-4xl md:text-5xl font-black text-white">Every Role, One Platform</h2>
            <p className="text-white/50 mt-4 text-lg max-w-xl mx-auto">Explore the complete Empire Deliveries platform — from customers to admins.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {[
              { id: 'customer-splash', label: 'Customer App', sub: 'Mobile-first delivery experience', icon: <Smartphone className="w-7 h-7" />, desc: 'Order food, track deliveries live, earn Royalty Points, and manage your profile.', badge: 'Mobile App', color: '#D4AF37', features: ['Home & Search', 'Restaurant Menus', 'Live Tracking', 'Loyalty Program'] },
              { id: 'driver', label: 'Driver App', sub: 'Earn on your schedule', icon: <Bike className="w-7 h-7" />, desc: 'Accept deliveries, navigate routes, and track your daily earnings effortlessly.', badge: 'Mobile App', color: '#00C853', features: ['Delivery Requests', 'Live Navigation', 'Earnings Dashboard', 'Wallet & Payouts'] },
              { id: 'restaurant', label: 'Partner Portal', sub: 'Restaurant management', icon: <UtensilsCrossed className="w-7 h-7" />, desc: 'Manage orders, update menus, view analytics and grow your restaurant business.', badge: 'Web Dashboard', color: '#FF9800', features: ['Order Management', 'Menu Builder', 'Analytics', 'Reviews'] },
              { id: 'admin', label: 'Admin Console', sub: 'Enterprise control panel', icon: <Shield className="w-7 h-7" />, desc: 'Full platform oversight — users, drivers, restaurants, revenue, and real-time monitoring.', badge: 'Enterprise', color: '#4299E1', features: ['Platform Analytics', 'User Management', 'Commission Control', 'System Settings'] },
            ].map(app => (
              <button
                key={app.id}
                onClick={() => onSelect(app.id as AppView)}
                onMouseEnter={() => setHover(app.id)}
                onMouseLeave={() => setHover(null)}
                className="group relative text-left bg-white/3 border border-white/8 rounded-3xl p-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                style={{ boxShadow: hover === app.id ? `0 20px 60px ${app.color}15` : undefined }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-transform group-hover:scale-110" style={{ background: `${app.color}20`, border: `1px solid ${app.color}30` }}>
                    <span style={{ color: app.color }}>{app.icon}</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full border" style={{ color: app.color, borderColor: `${app.color}30`, background: `${app.color}10` }}>{app.badge}</span>
                </div>
                <h3 className="font-black text-xl text-white mb-1">{app.label}</h3>
                <p className="text-white/50 text-sm mb-4">{app.sub}</p>
                <p className="text-white/40 text-xs leading-relaxed mb-5">{app.desc}</p>
                <div className="space-y-1.5 mb-6">
                  {app.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs text-white/50">
                      <div className="w-1 h-1 rounded-full" style={{ background: app.color }} />
                      {f}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 font-bold text-sm transition-colors" style={{ color: app.color }}>
                  Launch <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Features Strip */}
      <div className="relative z-10 border-t border-white/5 py-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {[
              { icon: <Zap className="w-6 h-6" />, title: '30 Min Delivery', sub: 'Average delivery time' },
              { icon: <MapPin className="w-6 h-6" />, title: 'Live Tracking', sub: 'Real-time GPS' },
              { icon: <Star className="w-6 h-6" />, title: 'Royalty Points', sub: 'Earn on every order' },
              { icon: <Users className="w-6 h-6" />, title: '1,200+ Drivers', sub: 'Ready near you' },
              { icon: <Package className="w-6 h-6" />, title: '4 Services', sub: 'Food, grocery, pharma, courier' },
              { icon: <Globe className="w-6 h-6" />, title: '15 Cities', sub: 'And expanding' },
            ].map(f => (
              <div key={f.title} className="text-center">
                <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/20 rounded-2xl flex items-center justify-center text-gold-400 mx-auto mb-3">{f.icon}</div>
                <p className="text-white font-bold text-sm">{f.title}</p>
                <p className="text-white/40 text-xs mt-0.5">{f.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SA Cities */}
      <div className="relative z-10 border-t border-white/5 py-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-gold-500 text-sm font-bold uppercase tracking-widest mb-3">Coverage</p>
            <h2 className="text-3xl font-black text-white">Serving South Africa</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {['Johannesburg', 'Pretoria', 'Sandton', 'Midrand', 'Cape Town', 'Durban', 'Mbombela', 'Polokwane', 'Bloemfontein', 'Port Elizabeth', 'Boksburg', 'Soweto', 'Centurion', 'Roodepoort', 'Randburg'].map(city => (
              <div key={city} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                <span className="text-white/70 text-sm font-medium">{city}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-white/5 py-8 px-6 lg:px-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-7 h-7 bg-gold-500 rounded-xl flex items-center justify-center">
            <Crown className="w-4 h-4 text-empire-black" strokeWidth={1.5} />
          </div>
          <span className="text-white/60 text-sm">Empire Deliveries — Fast. Reliable. Royal.</span>
        </div>
        <p className="text-white/30 text-xs">© 2024 Empire Deliveries (Pty) Ltd. Registered in South Africa.</p>
      </div>
    </div>
  );
};

// ─── Mobile Shell ──────────────────────────────────────────────────────────────
const MobileShell: React.FC<{ children: React.ReactNode; onBack: () => void; title?: string }> = ({ children, onBack, title }) => (
  <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-4">
    <div className="w-full max-w-sm mb-4 flex items-center justify-between">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-empire-black transition-colors">
        ← Back to Platform
      </button>
      {title && <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</span>}
    </div>
    <div className="w-full max-w-sm rounded-[44px] overflow-hidden shadow-2xl border-8 border-empire-black ring-1 ring-black/10" style={{ minHeight: '812px' }}>
      {children}
    </div>
  </div>
);

// ─── Full Desktop Shell ────────────────────────────────────────────────────────
const DesktopShell: React.FC<{ children: React.ReactNode; onBack: () => void }> = ({ children, onBack }) => (
  <div className="min-h-screen flex flex-col">
    <div className="bg-empire-black border-b border-white/10 px-6 py-3 flex items-center gap-4">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors">
        ← Platform
      </button>
      <div className="h-4 w-px bg-white/10" />
      <EmpireLogoSmall />
    </div>
    <div className="flex-1 overflow-auto">{children}</div>
  </div>
);

const EmpireLogoSmall: React.FC = () => (
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 bg-gold-500 rounded-lg flex items-center justify-center">
      <Crown className="w-4 h-4 text-empire-black" strokeWidth={1.5} />
    </div>
    <span className="text-white font-bold text-sm">Empire Deliveries</span>
  </div>
);

// ─── Root App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState<AppView>('landing');

  const goLanding = () => setView('landing');

  if (view === 'landing') return <LandingPage onSelect={setView} />;

  if (view === 'customer-splash') return (
    <MobileShell onBack={goLanding} title="Customer App">
      <SplashScreen onDone={() => setView('customer-onboarding')} />
    </MobileShell>
  );
  if (view === 'customer-onboarding') return (
    <MobileShell onBack={goLanding} title="Customer App">
      <OnboardingScreen onDone={() => setView('customer-auth')} />
    </MobileShell>
  );
  if (view === 'customer-auth') return (
    <MobileShell onBack={goLanding} title="Customer App">
      <AuthScreen onDone={() => setView('customer-location')} />
    </MobileShell>
  );
  if (view === 'customer-location') return (
    <MobileShell onBack={goLanding} title="Customer App">
      <LocationScreen onDone={() => setView('customer-app')} />
    </MobileShell>
  );
  if (view === 'customer-app') return (
    <MobileShell onBack={goLanding} title="Customer App">
      <CustomerApp onLogout={goLanding} />
    </MobileShell>
  );
  if (view === 'driver') return (
    <MobileShell onBack={goLanding} title="Driver App">
      <DriverApp onLogout={goLanding} />
    </MobileShell>
  );
  if (view === 'restaurant') return (
    <DesktopShell onBack={goLanding}>
      <RestaurantPortal onLogout={goLanding} />
    </DesktopShell>
  );
  if (view === 'admin') return (
    <DesktopShell onBack={goLanding}>
      <AdminPanel onLogout={goLanding} />
    </DesktopShell>
  );

  return <LandingPage onSelect={setView} />;
}

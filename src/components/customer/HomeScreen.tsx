import React, { useState } from 'react';
import { Search, Bell, ChevronDown, MapPin, Flame, Star, TrendingUp } from 'lucide-react';
import { RESTAURANTS, CATEGORIES, PROMO_BANNERS, GROCERY_STORES, PHARMACIES } from '../../data/mockData';
import { StatusBar, CategoryPill, RestaurantCard, SectionHeader, EmpireLogo, Badge } from '../ui';

// ─── Home Screen ──────────────────────────────────────────────────────────────────
export const HomeScreen: React.FC<{ onRestaurant: (id: string) => void; onSearch: () => void }> = ({ onRestaurant, onSearch }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [bannerIdx, setBannerIdx] = useState(0);
  const featured = RESTAURANTS.filter(r => r.isFeatured);
  const popular = RESTAURANTS.filter(r => r.isPopular);
  const banner = PROMO_BANNERS[bannerIdx];

  return (
    <div className="mobile-screen flex flex-col bg-surface-100 overflow-y-auto pb-24 no-scrollbar">
      <StatusBar dark />
      {/* Header */}
      <div className="bg-empire-black px-5 pt-4 pb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="flex items-center justify-between mb-4">
          <EmpireLogoWhite />
          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-500 rounded-full" />
            </button>
            <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-gold-500">
              <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        <div>
          <p className="text-white/60 text-xs font-medium mb-0.5">Good afternoon, 👋</p>
          <h1 className="text-xl font-black text-white mb-1">Thabo Nkosi</h1>
          <button className="flex items-center gap-1.5 text-gold-400 text-sm font-medium">
            <MapPin className="w-4 h-4" />
            14 Rivonia Rd, Sandton
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-5 -mt-5 z-10 relative mb-4">
        <button onClick={onSearch} className="w-full bg-white rounded-2xl shadow-card flex items-center gap-3 px-4 py-3.5 border border-surface-200">
          <Search className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400 text-sm">Search restaurants or dishes...</span>
        </button>
      </div>

      <div className="space-y-6 px-5">
        {/* Promo Banner */}
        <div>
          <div className="relative rounded-3xl overflow-hidden h-40 cursor-pointer" style={{ background: banner.bgColor }} onClick={() => setBannerIdx((bannerIdx + 1) % PROMO_BANNERS.length)}>
            <img src={banner.image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 flex flex-col justify-center px-6">
              <Badge variant={banner.bgColor === '#D4AF37' ? 'dark' : 'gold'}>Limited Time</Badge>
              <h3 className="text-xl font-black mt-2 leading-tight" style={{ color: banner.textColor }}>{banner.title}</h3>
              <p className="text-sm font-medium mt-1 opacity-80" style={{ color: banner.textColor }}>{banner.subtitle}</p>
            </div>
            <div className="absolute bottom-4 right-4 flex gap-1.5">
              {PROMO_BANNERS.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all ${i === bannerIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Services */}
        <div>
          <SectionHeader title="What do you need?" />
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: '🍔', label: 'Food', sub: 'Restaurants', bg: '#FFF8E7' },
              { icon: '🛒', label: 'Groceries', sub: 'Supermarkets', bg: '#F0FFF4' },
              { icon: '💊', label: 'Pharmacy', sub: 'Medicine', bg: '#EBF8FF' },
              { icon: '📦', label: 'Courier', sub: 'Packages', bg: '#FFF5F5' },
            ].map(s => (
              <button key={s.label} className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all hover:scale-105 active:scale-95" style={{ background: s.bg }}>
                <span className="text-2xl">{s.icon}</span>
                <span className="text-xs font-bold text-empire-black">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <SectionHeader title="Categories" />
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5">
            {CATEGORIES.map(c => (
              <CategoryPill key={c.id} icon={c.icon} name={c.name} active={activeCategory === c.id} onClick={() => setActiveCategory(activeCategory === c.id ? null : c.id)} />
            ))}
          </div>
        </div>

        {/* Featured */}
        <div>
          <SectionHeader title="Featured Restaurants" action="See All" />
          <div className="grid grid-cols-1 gap-4">
            {featured.slice(0, 2).map(r => (
              <RestaurantCard key={r.id} {...r} reviewCount={r.reviewCount} onClick={() => onRestaurant(r.id)} />
            ))}
          </div>
        </div>

        {/* Popular */}
        <div>
          <SectionHeader title="Popular Near You" action="See All" />
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
            {popular.map(r => (
              <RestaurantCard key={r.id} variant="wide" {...r} reviewCount={r.reviewCount} onClick={() => onRestaurant(r.id)} />
            ))}
          </div>
        </div>

        {/* Grocery Stores */}
        <div>
          <SectionHeader title="Grocery Delivery" action="See All" />
          <div className="grid grid-cols-2 gap-3">
            {GROCERY_STORES.map(g => (
              <div key={g.id} className="card-hover overflow-hidden">
                <div className="h-28 overflow-hidden">
                  <img src={g.image} alt={g.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-xs text-empire-black truncate">{g.name}</h4>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{g.deliveryTime}</span>
                    <div className="flex items-center gap-0.5 text-xs font-semibold">
                      <Star className="w-3 h-3 fill-gold-500 text-gold-500" />{g.rating}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pharmacy */}
        <div>
          <SectionHeader title="Pharmacy Delivery" action="See All" />
          <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-5 px-5">
            {PHARMACIES.map(p => (
              <div key={p.id} className="card-hover overflow-hidden flex-shrink-0 w-48">
                <div className="h-28 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-xs text-empire-black truncate">{p.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{p.deliveryTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending */}
        <div>
          <SectionHeader title="Trending This Week" />
          <div className="space-y-3">
            {['Zinger Tower Burger at KFC', 'Peri-Peri Chicken at Nandos', 'Triple Decker at Debonairs'].map((item, i) => (
              <div key={item} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-surface-200">
                <div className="w-8 h-8 bg-gold-500 rounded-xl flex items-center justify-center text-empire-black font-black text-sm">{i + 1}</div>
                <span className="text-sm font-medium text-empire-black flex-1">{item}</span>
                <TrendingUp className="w-4 h-4 text-empire-success" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmpireLogoWhite: React.FC = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-gold-500 rounded-xl flex items-center justify-center">
      <span className="text-empire-black font-black text-xs">E</span>
    </div>
    <div>
      <div className="font-black text-white text-sm tracking-tight leading-none">EMPIRE</div>
      <div className="text-gold-500 font-semibold tracking-widest uppercase text-[9px]">Deliveries</div>
    </div>
  </div>
);

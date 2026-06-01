import React from 'react';
import { Crown, Star, Clock, MapPin, TrendingUp, ChevronRight, Bike, Package, ShoppingBag, Pill } from 'lucide-react';

// ─── Crown Logo ────────────────────────────────────────────────────────────────
export const EmpireLogo: React.FC<{ size?: number; animated?: boolean }> = ({ size = 40, animated = false }) => (
  <div className={`flex items-center gap-2.5 ${animated ? 'animate-fade-in' : ''}`}>
    <div className="relative">
      <div className="absolute inset-0 bg-gold-500/20 rounded-xl blur-md animate-pulse-gold" />
      <div className="relative bg-empire-black rounded-xl p-2" style={{ width: size, height: size }}>
        <Crown className="text-gold-500 w-full h-full" strokeWidth={1.5} />
      </div>
    </div>
    <div>
      <div className="font-black text-empire-black tracking-tight leading-none" style={{ fontSize: size * 0.45 }}>
        EMPIRE
      </div>
      <div className="text-gold-500 font-semibold tracking-widest uppercase" style={{ fontSize: size * 0.22 }}>
        Deliveries
      </div>
    </div>
  </div>
);

export const EmpireLogoWhite: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <div className="flex items-center gap-2.5">
    <div className="relative bg-gold-500 rounded-xl p-2" style={{ width: size, height: size }}>
      <Crown className="text-empire-black w-full h-full" strokeWidth={1.5} />
    </div>
    <div>
      <div className="font-black text-white tracking-tight leading-none" style={{ fontSize: size * 0.45 }}>EMPIRE</div>
      <div className="text-gold-500 font-semibold tracking-widest uppercase" style={{ fontSize: size * 0.22 }}>Deliveries</div>
    </div>
  </div>
);

// ─── Badge ──────────────────────────────────────────────────────────────────────
export const Badge: React.FC<{ children: React.ReactNode; variant?: 'gold' | 'dark' | 'success' | 'warning' | 'error' | 'outline' }> = ({ children, variant = 'gold' }) => {
  const styles = {
    gold: 'bg-gold-500/10 text-gold-700 border border-gold-500/20',
    dark: 'bg-empire-black text-white',
    success: 'bg-green-50 text-empire-success border border-green-200',
    warning: 'bg-orange-50 text-empire-warning border border-orange-200',
    error: 'bg-red-50 text-empire-error border border-red-200',
    outline: 'border border-surface-300 text-gray-600',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${styles[variant]}`}>
      {children}
    </span>
  );
};

// ─── Rating Stars ───────────────────────────────────────────────────────────────
export const RatingBadge: React.FC<{ rating: number; count?: number }> = ({ rating, count }) => (
  <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700">
    <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
    {rating.toFixed(1)}
    {count && <span className="text-gray-400 font-normal">({count.toLocaleString()})</span>}
  </span>
);

// ─── Delivery Info Row ──────────────────────────────────────────────────────────
export const DeliveryInfo: React.FC<{ time: string; fee: number; distance: string }> = ({ time, fee, distance }) => (
  <div className="flex items-center gap-3 text-xs text-gray-500">
    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{time} min</span>
    <span className="w-1 h-1 bg-gray-300 rounded-full" />
    <span className="flex items-center gap-1"><Bike className="w-3.5 h-3.5" />{fee === 0 ? 'Free' : `R${fee}`}</span>
    <span className="w-1 h-1 bg-gray-300 rounded-full" />
    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{distance}</span>
  </div>
);

// ─── Restaurant Card ────────────────────────────────────────────────────────────
export const RestaurantCard: React.FC<{
  name: string; image: string; cuisine: string; rating: number;
  reviewCount: number; deliveryTime: string; deliveryFee: number;
  distance: string; isOpen: boolean; promo?: string;
  onClick?: () => void; variant?: 'default' | 'wide';
}> = ({ name, image, cuisine, rating, reviewCount, deliveryTime, deliveryFee, distance, isOpen, promo, onClick, variant = 'default' }) => {
  if (variant === 'wide') {
    return (
      <div onClick={onClick} className="card-hover flex gap-3 p-3 min-w-[280px]">
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
          <img src={image} alt={name} className="w-full h-full object-cover" />
          {!isOpen && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white text-xs font-bold">CLOSED</span></div>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-sm text-empire-black truncate">{name}</h3>
            {promo && <Badge variant="gold">{promo}</Badge>}
          </div>
          <p className="text-xs text-gray-500 mt-0.5 mb-2">{cuisine}</p>
          <RatingBadge rating={rating} count={reviewCount} />
          <div className="mt-1.5">
            <DeliveryInfo time={deliveryTime} fee={deliveryFee} distance={distance} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div onClick={onClick} className="card-hover overflow-hidden">
      <div className="relative h-40 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        {!isOpen && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white text-sm font-bold">CLOSED</span></div>}
        {promo && (
          <div className="absolute top-3 left-3">
            <Badge variant="dark">{promo}</Badge>
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-sm text-empire-black">{name}</h3>
          <RatingBadge rating={rating} count={reviewCount} />
        </div>
        <p className="text-xs text-gray-500 mb-2">{cuisine}</p>
        <DeliveryInfo time={deliveryTime} fee={deliveryFee} distance={distance} />
      </div>
    </div>
  );
};

// ─── Category Pill ───────────────────────────────────────────────────────────────
export const CategoryPill: React.FC<{ icon: string; name: string; active?: boolean; onClick?: () => void }> = ({ icon, name, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl transition-all duration-200 flex-shrink-0 ${active ? 'bg-empire-black text-white shadow-card' : 'bg-surface-100 text-gray-600 hover:bg-surface-200'}`}>
    <span className="text-xl">{icon}</span>
    <span className="text-xs font-semibold whitespace-nowrap">{name}</span>
  </button>
);

// ─── Section Header ──────────────────────────────────────────────────────────────
export const SectionHeader: React.FC<{ title: string; action?: string; onAction?: () => void }> = ({ title, action, onAction }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="section-title">{title}</h2>
    {action && (
      <button onClick={onAction} className="flex items-center gap-1 text-gold-600 text-sm font-semibold">
        {action}<ChevronRight className="w-4 h-4" />
      </button>
    )}
  </div>
);

// ─── Skeleton Loader ─────────────────────────────────────────────────────────────
export const SkeletonCard: React.FC<{ variant?: 'restaurant' | 'item' }> = ({ variant = 'restaurant' }) => (
  <div className="card overflow-hidden">
    <div className={`skeleton ${variant === 'restaurant' ? 'h-40' : 'h-32'} rounded-none`} />
    <div className="p-3 space-y-2">
      <div className="skeleton h-4 w-3/4 rounded-full" />
      <div className="skeleton h-3 w-1/2 rounded-full" />
      <div className="skeleton h-3 w-full rounded-full" />
    </div>
  </div>
);

// ─── Menu Item Card ──────────────────────────────────────────────────────────────
export const MenuItemCard: React.FC<{
  name: string; description: string; price: number; image: string;
  isPopular?: boolean; onAdd?: () => void;
}> = ({ name, description, price, image, isPopular, onAdd }) => (
  <div className="flex gap-3 py-4 border-b border-surface-100 last:border-0">
    <div className="flex-1">
      {isPopular && <Badge variant="gold">Popular</Badge>}
      <h4 className="font-semibold text-sm text-empire-black mt-1">{name}</h4>
      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{description}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="font-bold text-empire-black">R{price.toFixed(2)}</span>
        <button onClick={onAdd} className="w-8 h-8 bg-empire-black text-gold-500 rounded-full flex items-center justify-center font-bold text-lg hover:bg-empire-charcoal transition-colors">+</button>
      </div>
    </div>
    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
      <img src={image} alt={name} className="w-full h-full object-cover" />
    </div>
  </div>
);

// ─── Order Status Badge ───────────────────────────────────────────────────────────
export const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'gold' | 'dark' }> = {
    placed: { label: 'Order Placed', variant: 'dark' },
    confirmed: { label: 'Confirmed', variant: 'gold' },
    preparing: { label: 'Preparing', variant: 'warning' },
    picked_up: { label: 'Picked Up', variant: 'warning' },
    on_way: { label: 'On the Way', variant: 'gold' },
    delivered: { label: 'Delivered', variant: 'success' },
    cancelled: { label: 'Cancelled', variant: 'error' },
  };
  const c = config[status] || { label: status, variant: 'outline' as const };
  return <Badge variant={c.variant}>{c.label}</Badge>;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────────
export const StatCard: React.FC<{ label: string; value: string; change?: string; positive?: boolean; icon: React.ReactNode }> = ({ label, value, change, positive, icon }) => (
  <div className="card p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-empire-black mt-1">{value}</p>
        {change && (
          <p className={`text-xs font-semibold mt-1 flex items-center gap-1 ${positive ? 'text-empire-success' : 'text-empire-error'}`}>
            <TrendingUp className={`w-3.5 h-3.5 ${!positive ? 'rotate-180' : ''}`} />
            {change} vs last period
          </p>
        )}
      </div>
      <div className="w-12 h-12 bg-surface-100 rounded-2xl flex items-center justify-center text-empire-black">
        {icon}
      </div>
    </div>
  </div>
);

// ─── Toast Notification ────────────────────────────────────────────────────────────
export const Toast: React.FC<{ message: string; type?: 'success' | 'error' | 'info'; visible: boolean }> = ({ message, type = 'success', visible }) => {
  const colors = { success: 'bg-empire-success', error: 'bg-empire-error', info: 'bg-empire-black' };
  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
      <div className={`${colors[type]} text-white px-5 py-3 rounded-2xl shadow-lift text-sm font-semibold flex items-center gap-2`}>
        {message}
      </div>
    </div>
  );
};

// ─── Empty State ───────────────────────────────────────────────────────────────────
export const EmptyState: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; action?: string; onAction?: () => void }> = ({ icon, title, subtitle, action, onAction }) => (
  <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
    <div className="w-20 h-20 bg-surface-100 rounded-3xl flex items-center justify-center mb-5 text-gray-400">
      {icon}
    </div>
    <h3 className="font-bold text-lg text-empire-black">{title}</h3>
    <p className="text-gray-500 text-sm mt-2 leading-relaxed">{subtitle}</p>
    {action && (
      <button onClick={onAction} className="btn-gold mt-6 text-sm py-2.5 px-6">{action}</button>
    )}
  </div>
);

// ─── Mobile Status Bar ──────────────────────────────────────────────────────────────
export const StatusBar: React.FC<{ dark?: boolean }> = ({ dark = true }) => (
  <div className={`h-11 flex items-center justify-between px-5 ${dark ? 'bg-empire-black text-white' : 'bg-white text-empire-black'}`}>
    <span className="text-xs font-semibold">9:41</span>
    <div className="flex items-center gap-1.5">
      <svg className="w-4 h-3" viewBox="0 0 17 12" fill="currentColor"><rect x="0" y="3" width="3" height="9" rx="0.5" opacity="0.3"/><rect x="4.5" y="2" width="3" height="10" rx="0.5" opacity="0.5"/><rect x="9" y="0.5" width="3" height="11.5" rx="0.5" opacity="0.75"/><rect x="13.5" y="0" width="3.5" height="12" rx="0.5"/></svg>
      <svg className="w-4 h-3" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.4C5.6 2.4 3.4 3.4 1.8 5L0 3.2C2 1.2 4.8 0 8 0s6 1.2 8 3.2L14.2 5C12.6 3.4 10.4 2.4 8 2.4z" opacity="0.4"/><path d="M8 5.6c-1.6 0-3 .6-4 1.6L2.4 5.6C3.8 4.2 5.8 3.2 8 3.2s4.2 1 5.6 2.4L12 7.2c-1-1-2.4-1.6-4-1.6z" opacity="0.7"/><circle cx="8" cy="11" r="2"/></svg>
      <svg className="w-6 h-3" viewBox="0 0 25 12" fill="currentColor"><rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" strokeOpacity="0.35" fill="none"/><rect x="2" y="2" width="16" height="8" rx="2" fill="currentColor"/><path d="M23 4v4a2 2 0 000-4z" opacity="0.4"/></svg>
    </div>
  </div>
);

// ─── Progress Steps ────────────────────────────────────────────────────────────────
export const OrderProgressSteps: React.FC<{ currentStatus: string }> = ({ currentStatus }) => {
  const steps = ['placed', 'confirmed', 'preparing', 'picked_up', 'on_way', 'delivered'];
  const labels = ['Placed', 'Confirmed', 'Preparing', 'Picked Up', 'On the Way', 'Delivered'];
  const currentIdx = steps.indexOf(currentStatus);
  return (
    <div className="relative">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-surface-200 -z-0" />
        <div className="absolute top-3.5 left-0 h-0.5 bg-gold-500 -z-0 transition-all duration-500" style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }} />
        {steps.map((step, i) => (
          <div key={step} className="flex flex-col items-center gap-1.5 z-10">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
              ${i <= currentIdx ? 'bg-gold-500 text-empire-black scale-110' : 'bg-surface-200 text-gray-400'}`}>
              {i < currentIdx ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium ${i <= currentIdx ? 'text-empire-black' : 'text-gray-400'}`}>{labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Service Card ──────────────────────────────────────────────────────────────────
export const ServiceCard: React.FC<{ icon: React.ReactNode; label: string; sub: string; bg: string; onClick?: () => void }> = ({ icon, label, sub, bg, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 p-4 rounded-3xl transition-all duration-200 hover:scale-105 active:scale-95" style={{ background: bg }}>
    <div className="w-12 h-12 flex items-center justify-center">{icon}</div>
    <div className="text-center">
      <div className="text-xs font-bold text-empire-black">{label}</div>
      <div className="text-xs text-gray-500">{sub}</div>
    </div>
  </button>
);

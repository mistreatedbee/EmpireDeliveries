import React, { useState } from 'react';
import { LayoutDashboard, Users, Bike, UtensilsCrossed, ShoppingBag, BarChart2, Tag, Bell, Settings, Map, Search, ChevronRight, TrendingUp, AlertCircle, CheckCircle, Clock, DollarSign, Package, Star, Globe, Shield, MessageSquare, Zap, Crown } from 'lucide-react';
import { RESTAURANTS, MOCK_ORDERS, formatPrice } from '../../data/mockData';
import { Badge, StatCard, EmpireLogo, OrderStatusBadge } from '../ui';

const ADMIN_NAV = [
  { id: 'overview', icon: LayoutDashboard, label: 'Overview', group: 'Main' },
  { id: 'analytics', icon: BarChart2, label: 'Analytics', group: 'Main' },
  { id: 'orders', icon: ShoppingBag, label: 'Order Monitoring', group: 'Operations' },
  { id: 'restaurants', icon: UtensilsCrossed, label: 'Restaurants', group: 'Operations' },
  { id: 'drivers', icon: Bike, label: 'Drivers', group: 'Operations' },
  { id: 'users', icon: Users, label: 'Users', group: 'Operations' },
  { id: 'promotions', icon: Tag, label: 'Promotions', group: 'Marketing' },
  { id: 'support', icon: MessageSquare, label: 'Support', group: 'Marketing' },
  { id: 'security', icon: Shield, label: 'Security', group: 'System' },
  { id: 'settings', icon: Settings, label: 'System Settings', group: 'System' },
];

// ─── Admin Panel ───────────────────────────────────────────────────────────────
export const AdminPanel: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [page, setPage] = useState('overview');

  const renderPage = () => {
    switch (page) {
      case 'analytics': return <AdminAnalytics />;
      case 'orders': return <AdminOrders />;
      case 'restaurants': return <AdminRestaurants />;
      case 'drivers': return <AdminDrivers />;
      case 'users': return <AdminUsers />;
      case 'promotions': return <AdminPromotions />;
      case 'support': return <AdminSupport />;
      case 'settings': return <AdminSettings onLogout={onLogout} />;
      default: return <AdminOverview onPage={setPage} />;
    }
  };

  const groups = [...new Set(ADMIN_NAV.map(n => n.group))];

  return (
    <div className="min-h-screen bg-surface-100 flex flex-col">
      {/* Header */}
      <header className="bg-empire-black h-16 flex items-center px-6 gap-4 z-20 sticky top-0 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gold-500 rounded-xl flex items-center justify-center">
            <Crown className="w-5 h-5 text-empire-black" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-white font-black text-sm leading-none">EMPIRE</p>
            <p className="text-gold-500 text-xs font-semibold tracking-widest">Admin Console</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-2 gap-2 w-64">
            <Search className="w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search anything..." className="bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none flex-1" />
          </div>
          <div className="flex items-center gap-2">
            {[
              { icon: <Bell className="w-4 h-4" />, badge: '5' },
              { icon: <AlertCircle className="w-4 h-4" />, badge: '2' },
            ].map((item, i) => (
              <button key={i} className="relative w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                {item.icon}
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-empire-error rounded-full text-white text-xs font-bold flex items-center justify-center">{item.badge}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-8 h-8 bg-gold-500 rounded-xl flex items-center justify-center text-empire-black font-black text-sm">SA</div>
            <div className="hidden md:block">
              <p className="text-white text-xs font-bold">Super Admin</p>
              <p className="text-white/40 text-xs">admin@empire.co.za</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="bg-empire-charcoal w-64 flex-shrink-0 flex flex-col overflow-y-auto no-scrollbar hidden lg:flex">
          <nav className="flex-1 p-4 space-y-4">
            {groups.map(group => (
              <div key={group}>
                <p className="text-white/30 text-xs font-bold uppercase tracking-widest px-3 mb-2">{group}</p>
                {ADMIN_NAV.filter(n => n.group === group).map(({ id, icon: Icon, label }) => (
                  <button key={id} onClick={() => setPage(id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-semibold transition-all mb-0.5 ${page === id ? 'bg-gold-500 text-empire-black' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className="p-4 border-t border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs text-white/40"><div className="w-1.5 h-1.5 bg-empire-success rounded-full animate-pulse" />All systems operational</div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar p-6">
          {/* Mobile Nav */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5 lg:hidden">
            {ADMIN_NAV.map(({ id, label }) => (
              <button key={id} onClick={() => setPage(id)} className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${page === id ? 'bg-empire-black text-white' : 'bg-white text-gray-500 border border-surface-200'}`}>{label}</button>
            ))}
          </div>
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

// ─── Overview Page ─────────────────────────────────────────────────────────────
const AdminOverview: React.FC<{ onPage: (p: string) => void }> = ({ onPage }) => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 className="text-2xl font-black text-empire-black">Platform Overview</h1>
        <p className="text-gray-500 text-sm">Monday, 3 June 2024 · Live</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-empire-success rounded-full animate-pulse" />
          <span className="text-xs font-bold text-empire-success">All Systems Operational</span>
        </div>
      </div>
    </div>

    {/* KPI Cards */}
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard label="Total Revenue (Today)" value="R284,500" change="+21%" positive icon={<DollarSign className="w-5 h-5" />} />
      <StatCard label="Active Orders" value="1,247" change="+8%" positive icon={<ShoppingBag className="w-5 h-5" />} />
      <StatCard label="Active Drivers" value="892" change="+12%" positive icon={<Bike className="w-5 h-5" />} />
      <StatCard label="Registered Users" value="284,450" change="+3.2%" positive icon={<Users className="w-5 h-5" />} />
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      {/* Revenue Chart */}
      <div className="xl:col-span-2 card p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-empire-black">Revenue Overview</h2>
          <select className="text-xs border border-surface-200 rounded-xl px-3 py-1.5 text-gray-600 bg-white focus:outline-none focus:border-gold-500">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
        </div>
        <div className="flex items-end gap-2 h-40">
          {[{ day: 'Mon', val: 220 }, { day: 'Tue', val: 190 }, { day: 'Wed', val: 310 }, { day: 'Thu', val: 280 }, { day: 'Fri', val: 420 }, { day: 'Sat', val: 580 }, { day: 'Sun', val: 285 }].map(d => {
            const h = (d.val / 580) * 100;
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs font-bold text-gray-400">R{d.val}k</span>
                <div className="w-full relative" style={{ height: '100px' }}>
                  <div className="absolute bottom-0 w-full rounded-t-xl transition-all duration-500" style={{ height: `${h}%`, background: 'linear-gradient(to top, #D4AF37, #F5D876)' }} />
                </div>
                <span className="text-xs text-gray-400">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* City Breakdown */}
      <div className="card p-5">
        <h2 className="font-black text-empire-black mb-4">Top Cities</h2>
        {[{ city: 'Johannesburg', orders: 8420, pct: 100 }, { city: 'Cape Town', orders: 5280, pct: 63 }, { city: 'Pretoria', orders: 3840, pct: 46 }, { city: 'Durban', orders: 2940, pct: 35 }, { city: 'Sandton', orders: 2100, pct: 25 }].map(c => (
          <div key={c.city} className="mb-4 last:mb-0">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="font-semibold text-empire-black">{c.city}</span>
              <span className="text-gray-400">{c.orders.toLocaleString()} orders</span>
            </div>
            <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
              <div className="h-full bg-gold-500 rounded-full" style={{ width: `${c.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Live Orders & Alerts */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-empire-black">Live Orders</h2>
          <button onClick={() => onPage('orders')} className="text-gold-600 text-xs font-bold flex items-center gap-1">View All<ChevronRight className="w-3.5 h-3.5" /></button>
        </div>
        <div className="space-y-3">
          {[{ id: 'ORD-9044', restaurant: 'KFC Sandton', user: 'Thabo N.', status: 'on_way', city: 'JHB', total: 'R269' }, { id: 'ORD-9043', restaurant: "Nando's CT", user: 'Priya M.', status: 'preparing', city: 'CPT', total: 'R189' }, { id: 'ORD-9042', restaurant: 'Debonairs PTA', user: 'James K.', status: 'delivered', city: 'PTA', total: 'R145' }].map(o => (
            <div key={o.id} className="flex items-center gap-3 py-2.5 border-b border-surface-100 last:border-0">
              <div className="flex-1">
                <div className="flex items-center gap-2"><span className="font-bold text-xs text-empire-black">{o.id}</span><span className="text-xs text-gray-400">{o.city}</span></div>
                <p className="text-xs text-gray-500 mt-0.5">{o.restaurant} · {o.user}</p>
              </div>
              <OrderStatusBadge status={o.status} />
              <span className="font-bold text-sm text-empire-black ml-2">{o.total}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-empire-black">System Alerts</h2>
          <Badge variant="error">3 New</Badge>
        </div>
        {[{ type: 'error', title: 'Payment Gateway Latency', body: 'Ozow experiencing 3s delays. Monitoring.', time: '5 min ago' }, { type: 'warning', title: 'Driver Shortage', body: 'Durban zone has 12 unassigned orders.', time: '18 min ago' }, { type: 'success', title: 'Database Optimisation', body: 'Query performance improved by 34%.', time: '1 hr ago' }].map(alert => (
          <div key={alert.title} className={`flex gap-3 p-3 rounded-2xl mb-3 last:mb-0 ${alert.type === 'error' ? 'bg-red-50' : alert.type === 'warning' ? 'bg-orange-50' : 'bg-green-50'}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${alert.type === 'error' ? 'bg-empire-error' : alert.type === 'warning' ? 'bg-empire-warning' : 'bg-empire-success'}`}>
              {alert.type === 'error' ? <AlertCircle className="w-4 h-4 text-white" /> : alert.type === 'warning' ? <Clock className="w-4 h-4 text-white" /> : <CheckCircle className="w-4 h-4 text-white" />}
            </div>
            <div>
              <p className="font-bold text-xs text-empire-black">{alert.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{alert.body}</p>
              <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Analytics Page ────────────────────────────────────────────────────────────
const AdminAnalytics: React.FC = () => (
  <div className="space-y-6 animate-fade-in">
    <h1 className="text-2xl font-black text-empire-black">Revenue Analytics</h1>
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard label="Total Revenue" value="R8.4M" change="+28%" positive icon={<TrendingUp className="w-5 h-5" />} />
      <StatCard label="Platform Fees" value="R1.2M" change="+28%" positive icon={<DollarSign className="w-5 h-5" />} />
      <StatCard label="Commissions" value="R840K" change="+18%" positive icon={<Package className="w-5 h-5" />} />
      <StatCard label="Delivery Revenue" value="R420K" change="+35%" positive icon={<Bike className="w-5 h-5" />} />
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <div className="card p-5">
        <h2 className="font-black text-empire-black mb-4">Revenue by Category</h2>
        {[{ name: 'Food Delivery', pct: 68, amount: 'R5.7M', color: '#D4AF37' }, { name: 'Grocery Delivery', pct: 18, amount: 'R1.5M', color: '#00C853' }, { name: 'Pharmacy', pct: 9, amount: 'R756K', color: '#4299E1' }, { name: 'Courier', pct: 5, amount: 'R420K', color: '#FF9800' }].map(cat => (
          <div key={cat.name} className="mb-4 last:mb-0">
            <div className="flex justify-between mb-1.5">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ background: cat.color }} /><span className="text-sm font-semibold text-empire-black">{cat.name}</span></div>
              <div className="text-right"><span className="font-bold text-sm text-empire-black">{cat.amount}</span><span className="text-xs text-gray-400 ml-2">{cat.pct}%</span></div>
            </div>
            <div className="h-2 bg-surface-200 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${cat.pct}%`, background: cat.color }} /></div>
          </div>
        ))}
      </div>
      <div className="card p-5">
        <h2 className="font-black text-empire-black mb-4">Monthly Growth</h2>
        <div className="space-y-3">
          {[{ month: 'January', growth: '+12%', revenue: 'R6.1M' }, { month: 'February', growth: '+18%', revenue: 'R7.2M' }, { month: 'March', growth: '+22%', revenue: 'R8.8M' }, { month: 'April', growth: '+15%', revenue: 'R10.1M' }, { month: 'May', growth: '+28%', revenue: 'R12.9M' }].map(m => (
            <div key={m.month} className="flex items-center justify-between py-2.5 border-b border-surface-100 last:border-0">
              <span className="text-sm text-gray-600">{m.month}</span>
              <span className="text-xs font-bold text-empire-success bg-green-50 px-2 py-1 rounded-full">{m.growth}</span>
              <span className="font-bold text-sm text-empire-black">{m.revenue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─── Admin Orders ──────────────────────────────────────────────────────────────
const AdminOrders: React.FC = () => {
  const [search, setSearch] = useState('');
  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-black text-empire-black">Order Monitoring</h1>
        <div className="flex gap-3 items-center">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 py-2 text-sm w-52" /></div>
          <Badge variant="gold">● 1,247 Active</Badge>
        </div>
      </div>
      <div className="card overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-surface-50 border-b border-surface-100">
              {['Order ID', 'Customer', 'Restaurant', 'City', 'Total', 'Status', 'Driver', 'Time'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { id: 'ORD-9044', customer: 'Thabo Nkosi', restaurant: 'KFC Sandton', city: 'JHB', total: 'R269.80', status: 'on_way', driver: 'Sipho D.', time: '14:28' },
              { id: 'ORD-9043', customer: 'Priya Maharaj', restaurant: "Nando's CT", city: 'CPT', total: 'R189.90', status: 'preparing', driver: 'Unassigned', time: '14:31' },
              { id: 'ORD-9042', customer: 'James Kruger', restaurant: 'Debonairs PTA', city: 'PTA', total: 'R144.90', status: 'delivered', driver: 'Moses K.', time: '14:15' },
              { id: 'ORD-9041', customer: 'Amina Patel', restaurant: 'Steers JHB', city: 'JHB', total: 'R92.90', status: 'confirmed', driver: 'Unassigned', time: '14:35' },
              { id: 'ORD-9040', customer: 'Ryan Smith', restaurant: "McDonald's CPT", city: 'CPT', total: 'R178.50', status: 'placed', driver: '—', time: '14:38' },
            ].filter(o => !search || o.id.includes(search) || o.customer.toLowerCase().includes(search.toLowerCase())).map((order, i) => (
              <tr key={order.id} className={`border-b border-surface-50 hover:bg-surface-50 transition-colors ${i % 2 ? 'bg-surface-50/40' : ''}`}>
                <td className="px-4 py-3 font-bold text-sm text-empire-black">{order.id}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{order.customer}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{order.restaurant}</td>
                <td className="px-4 py-3"><Badge variant="outline">{order.city}</Badge></td>
                <td className="px-4 py-3 font-bold text-sm">{order.total}</td>
                <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                <td className="px-4 py-3 text-xs text-gray-500">{order.driver}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{order.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Admin Restaurants ─────────────────────────────────────────────────────────
const AdminRestaurants: React.FC = () => (
  <div className="space-y-5 animate-fade-in">
    <div className="flex items-center justify-between"><h1 className="text-2xl font-black text-empire-black">Restaurant Management</h1><div className="flex gap-2"><Badge variant="success">● 284 Active</Badge><Badge variant="warning">12 Pending</Badge></div></div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {RESTAURANTS.map(r => (
        <div key={r.id} className="card overflow-hidden">
          <div className="h-32 relative"><img src={r.image} alt={r.name} className="w-full h-full object-cover" /><div className="absolute top-2 right-2"><Badge variant={r.isOpen ? 'success' : 'error'}>{r.isOpen ? 'Open' : 'Closed'}</Badge></div></div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-1"><h3 className="font-bold text-sm text-empire-black">{r.name}</h3><span className="text-xs text-gray-400">★ {r.rating}</span></div>
            <p className="text-xs text-gray-500 mb-1">{r.cuisine}</p>
            <p className="text-xs text-gray-400">{r.address}, {r.city}</p>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-2 bg-surface-100 rounded-xl text-xs font-semibold text-gray-600 hover:bg-surface-200 transition-colors">Manage</button>
              <button className="flex-1 py-2 bg-empire-black rounded-xl text-xs font-semibold text-gold-500 hover:bg-empire-charcoal transition-colors">Analytics</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Admin Drivers ─────────────────────────────────────────────────────────────
const AdminDrivers: React.FC = () => (
  <div className="space-y-5 animate-fade-in">
    <div className="flex items-center justify-between flex-wrap gap-3">
      <h1 className="text-2xl font-black text-empire-black">Driver Management</h1>
      <div className="flex gap-2"><Badge variant="success">● 892 Online</Badge><Badge variant="outline">1,240 Total</Badge></div>
    </div>
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard label="Online Drivers" value="892" change="+12%" positive icon={<Bike className="w-5 h-5" />} />
      <StatCard label="Avg Rating" value="4.7★" change="+0.1" positive icon={<Star className="w-5 h-5" />} />
      <StatCard label="Avg Deliveries/Day" value="8.4" change="+5%" positive icon={<Package className="w-5 h-5" />} />
      <StatCard label="Driver Earnings" value="R284K/d" change="+18%" positive icon={<DollarSign className="w-5 h-5" />} />
    </div>
    <div className="card overflow-hidden overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="bg-surface-50 border-b border-surface-100">
            {['Driver', 'City', 'Status', 'Today\'s Earnings', 'Rating', 'Deliveries', 'Action'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            { name: 'Sipho Dlamini', city: 'Sandton', status: 'delivering', earn: 'R480', rating: '4.8', deliveries: 6 },
            { name: 'Moses Khumalo', city: 'Cape Town', status: 'online', earn: 'R320', rating: '4.6', deliveries: 4 },
            { name: 'Zanele Nkosi', city: 'Pretoria', status: 'delivering', earn: 'R540', rating: '4.9', deliveries: 7 },
            { name: 'Ruan Pieterse', city: 'Durban', status: 'offline', earn: 'R0', rating: '4.3', deliveries: 0 },
          ].map(d => (
            <tr key={d.name} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
              <td className="px-4 py-3 font-semibold text-sm text-empire-black">{d.name}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{d.city}</td>
              <td className="px-4 py-3"><Badge variant={d.status === 'delivering' ? 'gold' : d.status === 'online' ? 'success' : 'outline'}>{d.status}</Badge></td>
              <td className="px-4 py-3 font-bold text-sm text-empire-success">{d.earn}</td>
              <td className="px-4 py-3 text-sm text-gray-600">★ {d.rating}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{d.deliveries}</td>
              <td className="px-4 py-3"><button className="text-xs text-gold-600 font-bold">View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── Admin Users ───────────────────────────────────────────────────────────────
const AdminUsers: React.FC = () => (
  <div className="space-y-5 animate-fade-in">
    <div className="flex items-center justify-between"><h1 className="text-2xl font-black text-empire-black">User Management</h1><Badge variant="dark">284,450 Total</Badge></div>
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard label="Total Users" value="284.4K" change="+3.2%" positive icon={<Users className="w-5 h-5" />} />
      <StatCard label="New This Month" value="8,240" change="+15%" positive icon={<TrendingUp className="w-5 h-5" />} />
      <StatCard label="Active Users" value="142K" change="+8%" positive icon={<Zap className="w-5 h-5" />} />
      <StatCard label="Avg Orders/User" value="4.8" change="+0.3" positive icon={<ShoppingBag className="w-5 h-5" />} />
    </div>
    <div className="card overflow-hidden overflow-x-auto">
      <table className="w-full min-w-[600px]">
        <thead><tr className="bg-surface-50 border-b border-surface-100">{['User', 'City', 'Orders', 'Total Spent', 'Loyalty Tier', 'Joined', 'Action'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
        <tbody>
          {[{ name: 'Thabo Nkosi', city: 'Sandton', orders: 42, spent: 'R12,480', tier: 'Gold', joined: 'Jan 2023' }, { name: 'Priya Maharaj', city: 'Cape Town', orders: 28, spent: 'R8,200', tier: 'Silver', joined: 'Mar 2023' }, { name: 'James Kruger', city: 'Pretoria', orders: 15, spent: 'R4,100', tier: 'Bronze', joined: 'Jun 2023' }, { name: 'Nomsa Dlamini', city: 'Durban', orders: 61, spent: 'R18,900', tier: 'Platinum', joined: 'Dec 2022' }].map(u => (
            <tr key={u.name} className="border-b border-surface-50 hover:bg-surface-50 transition-colors">
              <td className="px-4 py-3 font-semibold text-sm text-empire-black">{u.name}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{u.city}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{u.orders}</td>
              <td className="px-4 py-3 font-bold text-sm">{u.spent}</td>
              <td className="px-4 py-3"><Badge variant={u.tier === 'Platinum' ? 'dark' : u.tier === 'Gold' ? 'gold' : 'outline'}>{u.tier}</Badge></td>
              <td className="px-4 py-3 text-xs text-gray-400">{u.joined}</td>
              <td className="px-4 py-3"><button className="text-xs text-gold-600 font-bold">View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ─── Admin Promotions ──────────────────────────────────────────────────────────
const AdminPromotions: React.FC = () => (
  <div className="space-y-5 animate-fade-in">
    <div className="flex items-center justify-between"><h1 className="text-2xl font-black text-empire-black">Promotions & Marketing</h1><button className="btn-gold text-sm py-2.5">+ New Campaign</button></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[{ name: 'EMPIRE50', type: 'Promo Code', discount: '50% off first order', used: 1247, active: true, expires: '30 Jun 2024' }, { name: 'Free Delivery Weekend', type: 'Automatic', discount: 'Free delivery all orders', used: 8420, active: true, expires: '2 Jun 2024' }, { name: 'ROYALTY2X', type: 'Promo Code', discount: '2x Royalty Points', used: 340, active: false, expires: '31 May 2024' }, { name: 'NEWUSER25', type: 'Promo Code', discount: '25% off', used: 2100, active: true, expires: '31 Dec 2024' }].map(promo => (
        <div key={promo.name} className="card p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2"><Badge variant={promo.active ? 'success' : 'error'}>{promo.active ? 'Active' : 'Inactive'}</Badge><Badge variant="outline">{promo.type}</Badge></div>
              <h3 className="font-black text-lg text-empire-black mt-2">{promo.name}</h3>
              <p className="text-sm text-gray-500">{promo.discount}</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-surface-100">
            <div className="text-sm"><span className="font-bold text-empire-black">{promo.used.toLocaleString()}</span><span className="text-gray-400 ml-1">uses</span></div>
            <div className="text-xs text-gray-400">Expires {promo.expires}</div>
            <button className="text-xs text-gold-600 font-bold">Edit</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Admin Support ─────────────────────────────────────────────────────────────
const AdminSupport: React.FC = () => (
  <div className="space-y-5 animate-fade-in">
    <div className="flex items-center justify-between"><h1 className="text-2xl font-black text-empire-black">Support Tickets</h1><div className="flex gap-2"><Badge variant="error">14 Open</Badge><Badge variant="warning">8 Pending</Badge></div></div>
    <div className="space-y-3">
      {[{ id: 'TKT-001', user: 'Thabo Nkosi', subject: 'Order not delivered', status: 'open', priority: 'high', time: '10 min ago' }, { id: 'TKT-002', user: 'Priya Maharaj', subject: 'Wrong items in order', status: 'pending', priority: 'medium', time: '1 hr ago' }, { id: 'TKT-003', user: 'James Kruger', subject: 'Refund not received', status: 'open', priority: 'high', time: '2 hr ago' }, { id: 'TKT-004', user: 'Nomsa D.', subject: 'App login issues', status: 'resolved', priority: 'low', time: '1 day ago' }].map(t => (
        <div key={t.id} className="card p-4 flex items-center gap-4">
          <div className={`w-2 h-10 rounded-full flex-shrink-0 ${t.priority === 'high' ? 'bg-empire-error' : t.priority === 'medium' ? 'bg-empire-warning' : 'bg-empire-success'}`} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5"><span className="font-bold text-xs text-gray-400">{t.id}</span><Badge variant={t.status === 'open' ? 'error' : t.status === 'pending' ? 'warning' : 'success'}>{t.status}</Badge></div>
            <p className="font-semibold text-sm text-empire-black">{t.subject}</p>
            <p className="text-xs text-gray-400">{t.user} · {t.time}</p>
          </div>
          <button className="text-xs font-bold text-gold-600">View</button>
        </div>
      ))}
    </div>
  </div>
);

// ─── Admin Settings ────────────────────────────────────────────────────────────
const AdminSettings: React.FC<{ onLogout: () => void }> = ({ onLogout }) => (
  <div className="space-y-5 animate-fade-in max-w-3xl">
    <h1 className="text-2xl font-black text-empire-black">System Settings</h1>
    {[
      { title: 'Platform Configuration', items: [{ label: 'Platform Name', value: 'Empire Deliveries' }, { label: 'Default Currency', value: 'ZAR (R)' }, { label: 'Default Language', value: 'English (ZA)' }, { label: 'Service Fee %', value: '4.2%' }] },
      { title: 'Commission Rates', items: [{ label: 'Restaurant Commission', value: '25%' }, { label: 'Driver Commission', value: '80% of delivery fee' }, { label: 'Payment Gateway Fee', value: '2.5% + R1.50' }] },
      { title: 'Security', items: [{ label: '2FA Required', value: 'Enabled' }, { label: 'Session Timeout', value: '24 hours' }, { label: 'Rate Limiting', value: '100 req/min' }] },
    ].map(section => (
      <div key={section.title} className="card p-5">
        <h3 className="font-bold text-empire-black mb-4">{section.title}</h3>
        {section.items.map(item => (
          <div key={item.label} className="flex justify-between items-center py-3 border-b border-surface-100 last:border-0">
            <span className="text-sm text-gray-500">{item.label}</span>
            <div className="flex items-center gap-3"><span className="font-semibold text-sm text-empire-black">{item.value}</span><button className="text-xs text-gold-600 font-bold">Edit</button></div>
          </div>
        ))}
      </div>
    ))}
    <button onClick={onLogout} className="text-empire-error font-semibold text-sm">Sign Out</button>
  </div>
);

import React, { useState } from 'react';
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, Tag, BarChart2, Star, Settings, Bell, Search, ChevronRight, TrendingUp, Clock, CheckCircle, AlertCircle, Users, Package, PlusCircle, Edit, Trash2, ChevronDown, Eye } from 'lucide-react';
import { MENU_ITEMS, MOCK_ORDERS, formatPrice } from '../../data/mockData';
import { Badge, StatCard, EmpireLogo, OrderStatusBadge } from '../ui';

const NAV = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'orders', icon: ShoppingBag, label: 'Orders' },
  { id: 'menu', icon: UtensilsCrossed, label: 'Menu' },
  { id: 'analytics', icon: BarChart2, label: 'Analytics' },
  { id: 'reviews', icon: Star, label: 'Reviews' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

// ─── Restaurant Portal ─────────────────────────────────────────────────────────
export const RestaurantPortal: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [page, setPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (page) {
      case 'orders': return <RestaurantOrders />;
      case 'menu': return <MenuManagement />;
      case 'analytics': return <RestaurantAnalytics />;
      case 'reviews': return <RestaurantReviews />;
      case 'settings': return <RestaurantSettings onLogout={onLogout} />;
      default: return <RestaurantDashboard onPage={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface-100 flex flex-col">
      {/* Top Bar */}
      <header className="bg-empire-black border-b border-white/5 h-16 flex items-center px-6 gap-4 z-20 sticky top-0">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white lg:hidden">☰</button>
        <EmpireLogo size={32} />
        <span className="text-white/40 text-sm font-medium hidden sm:block">Partner Portal</span>
        <div className="ml-auto flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search..." className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gold-500 w-48" />
          </div>
          <button className="relative w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-500 rounded-full" />
          </button>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-gold-500/30">
              <img src="https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=100" alt="Restaurant" className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:block">
              <p className="text-white text-xs font-bold">KFC Sandton City</p>
              <p className="text-white/40 text-xs">Sandton, JHB</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`bg-empire-charcoal w-60 flex-shrink-0 flex flex-col overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative top-16 lg:top-0 bottom-0 z-10`}>
          <nav className="flex-1 p-4 space-y-1">
            {NAV.map(({ id, icon: Icon, label }) => (
              <button key={id} onClick={() => setPage(id)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-semibold transition-all ${page === id ? 'bg-gold-500 text-empire-black' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-empire-success rounded-full animate-pulse" />
              <span className="text-xs text-white/60 font-medium">Restaurant is Open</span>
            </div>
            <button onClick={onLogout} className="w-full py-2 rounded-xl border border-white/10 text-white/60 text-xs font-semibold hover:bg-white/5 transition-colors">Sign Out</button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

// ─── Dashboard Page ────────────────────────────────────────────────────────────
const RestaurantDashboard: React.FC<{ onPage: (p: string) => void }> = ({ onPage }) => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-black text-empire-black">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Monday, 3 June 2024</p>
      </div>
      <Badge variant="success">● Open</Badge>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Today's Revenue" value="R4,820" change="+12%" positive icon={<TrendingUp className="w-5 h-5" />} />
      <StatCard label="Total Orders" value="38" change="+8%" positive icon={<ShoppingBag className="w-5 h-5" />} />
      <StatCard label="Avg Order Value" value="R127" change="+3%" positive icon={<Tag className="w-5 h-5" />} />
      <StatCard label="Avg Rating" value="4.2★" change="-0.1" positive={false} icon={<Star className="w-5 h-5" />} />
    </div>

    {/* Live Orders */}
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-empire-black">Live Orders</h2>
        <button onClick={() => onPage('orders')} className="text-gold-600 text-sm font-semibold flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[
          { id: 'ORD-9001', customer: 'Thabo N.', items: 'Zinger + Bucket', total: 'R269.80', status: 'preparing', time: '14:28' },
          { id: 'ORD-9002', customer: 'Priya M.', items: '1/4 Chicken + Chips', total: 'R124.90', status: 'confirmed', time: '14:31' },
          { id: 'ORD-9003', customer: 'James K.', items: 'Crunch Burger x2', total: 'R149.80', status: 'placed', time: '14:35' },
        ].map(order => (
          <div key={order.id} className="card p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-sm text-empire-black">{order.id}</p>
                <p className="text-xs text-gray-500">{order.customer} · {order.time}</p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="text-sm text-gray-600 mb-3">{order.items}</p>
            <div className="flex items-center justify-between">
              <span className="font-black text-empire-black">{order.total}</span>
              {order.status === 'placed' && (
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-empire-success text-white rounded-xl text-xs font-bold">Accept</button>
                  <button className="px-3 py-1.5 bg-empire-error text-white rounded-xl text-xs font-bold">Reject</button>
                </div>
              )}
              {order.status === 'confirmed' && <button className="px-3 py-1.5 bg-empire-warning text-white rounded-xl text-xs font-bold">Mark Ready</button>}
              {order.status === 'preparing' && <button className="px-3 py-1.5 bg-empire-black text-gold-500 rounded-xl text-xs font-bold">Ready</button>}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Quick Stats Chart */}
    <div className="card p-5">
      <h2 className="font-black text-empire-black mb-4">Revenue This Week</h2>
      <div className="flex items-end gap-3 h-32">
        {[{ day: 'Mon', val: 3200 }, { day: 'Tue', val: 2800 }, { day: 'Wed', val: 4100 }, { day: 'Thu', val: 3600 }, { day: 'Fri', val: 5200 }, { day: 'Sat', val: 6800 }, { day: 'Sun', val: 4820 }].map(d => {
          const h = (d.val / 6800) * 100;
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-xs font-bold text-empire-black">R{(d.val / 1000).toFixed(1)}k</span>
              <div className="w-full rounded-t-xl bg-gold-500/10 relative overflow-hidden" style={{ height: '80px' }}>
                <div className="absolute bottom-0 w-full rounded-t-xl bg-gold-500 transition-all duration-500" style={{ height: `${h}%` }} />
              </div>
              <span className="text-xs text-gray-400">{d.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

// ─── Orders Page ───────────────────────────────────────────────────────────────
const RestaurantOrders: React.FC = () => {
  const [tab, setTab] = useState('all');
  const orders = [...MOCK_ORDERS, { id: 'ORD-9001', restaurantName: 'KFC', restaurantImage: '', items: [{ name: 'Zinger Burger', qty: 1, price: 89.90 }], total: 89.90, status: 'preparing' as const, date: new Date().toISOString(), deliveryAddress: 'Sandton' }];

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-2xl font-black text-empire-black">Orders</h1>
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {['all', 'placed', 'preparing', 'on_way', 'delivered', 'cancelled'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${tab === t ? 'bg-empire-black text-white' : 'bg-white text-gray-500 border border-surface-200'}`}>
            {t.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-100">
              {['Order ID', 'Items', 'Total', 'Status', 'Date', 'Action'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.filter(o => tab === 'all' || o.status === tab).map((order, i) => (
              <tr key={order.id} className={`border-b border-surface-50 hover:bg-surface-50 transition-colors ${i % 2 === 0 ? '' : 'bg-surface-50/50'}`}>
                <td className="px-4 py-3 font-bold text-sm text-empire-black">{order.id}</td>
                <td className="px-4 py-3 text-xs text-gray-600">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                <td className="px-4 py-3 font-bold text-sm">{formatPrice(order.total)}</td>
                <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                <td className="px-4 py-3 text-xs text-gray-400">{new Date(order.date).toLocaleDateString('en-ZA')}</td>
                <td className="px-4 py-3">
                  <button className="flex items-center gap-1 text-xs text-gold-600 font-semibold"><Eye className="w-3.5 h-3.5" />View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── Menu Management ───────────────────────────────────────────────────────────
const MenuManagement: React.FC = () => (
  <div className="space-y-5 animate-fade-in">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-black text-empire-black">Menu Management</h1>
      <button className="btn-gold flex items-center gap-2 text-sm py-2.5"><PlusCircle className="w-4 h-4" />Add Item</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {MENU_ITEMS.map(item => (
        <div key={item.id} className="card overflow-hidden">
          <div className="h-36 overflow-hidden">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-bold text-sm text-empire-black">{item.name}</h3>
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${item.isAvailable ? 'bg-empire-success' : 'bg-empire-error'}`} />
            </div>
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.description}</p>
            <div className="flex items-center justify-between">
              <span className="font-black text-empire-black">{formatPrice(item.price)}</span>
              <div className="flex gap-2">
                <button className="w-8 h-8 bg-surface-100 rounded-xl flex items-center justify-center hover:bg-surface-200 transition-colors"><Edit className="w-3.5 h-3.5 text-gray-500" /></button>
                <button className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 className="w-3.5 h-3.5 text-empire-error" /></button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Analytics Page ────────────────────────────────────────────────────────────
const RestaurantAnalytics: React.FC = () => (
  <div className="space-y-5 animate-fade-in">
    <h1 className="text-2xl font-black text-empire-black">Analytics</h1>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Monthly Revenue" value="R48,200" change="+18%" positive icon={<TrendingUp className="w-5 h-5" />} />
      <StatCard label="Total Orders" value="412" change="+22%" positive icon={<ShoppingBag className="w-5 h-5" />} />
      <StatCard label="New Customers" value="89" change="+15%" positive icon={<Users className="w-5 h-5" />} />
      <StatCard label="Cancellation Rate" value="3.2%" change="-0.8%" positive icon={<AlertCircle className="w-5 h-5" />} />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="card p-5">
        <h3 className="font-bold text-empire-black mb-4">Top Selling Items</h3>
        {[{ name: 'Zinger Tower Burger', sold: 284, revenue: 'R25,555' }, { name: '8-Piece Bucket', sold: 156, revenue: 'R23,381' }, { name: "Colonel's Crunch", sold: 98, revenue: 'R7,340' }].map((item, i) => (
          <div key={item.name} className="flex items-center gap-3 py-3 border-b border-surface-100 last:border-0">
            <span className="w-7 h-7 bg-gold-500 rounded-full flex items-center justify-center text-empire-black font-black text-sm">{i + 1}</span>
            <div className="flex-1"><p className="font-semibold text-sm text-empire-black">{item.name}</p><p className="text-xs text-gray-400">{item.sold} sold</p></div>
            <span className="font-bold text-sm text-empire-black">{item.revenue}</span>
          </div>
        ))}
      </div>
      <div className="card p-5">
        <h3 className="font-bold text-empire-black mb-4">Peak Hours</h3>
        <div className="space-y-2">
          {[{ time: '12:00 – 14:00', orders: 42, pct: 85 }, { time: '18:00 – 20:00', orders: 38, pct: 76 }, { time: '11:00 – 12:00', orders: 22, pct: 44 }, { time: '20:00 – 22:00', orders: 18, pct: 36 }].map(h => (
            <div key={h.time}>
              <div className="flex justify-between text-xs mb-1"><span className="font-medium text-gray-600">{h.time}</span><span className="font-bold text-empire-black">{h.orders} orders</span></div>
              <div className="h-2 bg-surface-200 rounded-full overflow-hidden"><div className="h-full bg-gold-500 rounded-full" style={{ width: `${h.pct}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─── Reviews Page ──────────────────────────────────────────────────────────────
const RestaurantReviews: React.FC = () => (
  <div className="space-y-5 animate-fade-in">
    <h1 className="text-2xl font-black text-empire-black">Customer Reviews</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="card p-5 text-center md:col-span-1">
        <p className="text-5xl font-black text-empire-black">4.2</p>
        <div className="flex justify-center gap-1 mt-2">{[1,2,3,4,5].map(s => <span key={s} className={`text-xl ${s <= 4 ? 'text-gold-500' : 'text-gray-200'}`}>★</span>)}</div>
        <p className="text-gray-400 text-sm mt-1">1,847 reviews</p>
        <div className="mt-4 space-y-1">
          {[5,4,3,2,1].map(s => { const widths: Record<number,number> = {5:55,4:28,3:10,2:5,1:2}; return <div key={s} className="flex items-center gap-2"><span className="text-xs text-gray-400 w-3">{s}</span><div className="flex-1 h-1.5 bg-surface-200 rounded-full overflow-hidden"><div className="h-full bg-gold-500 rounded-full" style={{ width: `${widths[s]}%` }} /></div></div>; })}
        </div>
      </div>
      <div className="md:col-span-2 space-y-3">
        {[{ name: 'Sipho M.', rating: 5, text: 'Always fast and fresh. The Zinger is my go-to!', date: '2 days ago' }, { name: 'Nomsa D.', rating: 4, text: 'Food was great but packaging had a small spill. Driver was polite.', date: '1 week ago' }, { name: 'Ruan P.', rating: 5, text: 'Best fried chicken in Sandton. Never disappointed.', date: '2 weeks ago' }].map(r => (
          <div key={r.name} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-empire-black">{r.name}</span>
              <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <span key={s} className={`text-sm ${s <= r.rating ? 'text-gold-500' : 'text-gray-200'}`}>★</span>)}</div>
            </div>
            <p className="text-sm text-gray-600">{r.text}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-400">{r.date}</span>
              <button className="text-xs text-gold-600 font-semibold">Reply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Settings Page ─────────────────────────────────────────────────────────────
const RestaurantSettings: React.FC<{ onLogout: () => void }> = ({ onLogout }) => (
  <div className="space-y-5 animate-fade-in max-w-2xl">
    <h1 className="text-2xl font-black text-empire-black">Settings</h1>
    {[
      { title: 'Restaurant Details', fields: [{ label: 'Restaurant Name', value: 'KFC Sandton City' }, { label: 'Phone', value: '+27 11 000 0000' }, { label: 'Email', value: 'sandton@kfc.co.za' }] },
      { title: 'Operating Hours', fields: [{ label: 'Weekdays', value: '08:00 – 23:00' }, { label: 'Weekends', value: '08:00 – 00:00' }] },
      { title: 'Delivery Settings', fields: [{ label: 'Min Order Value', value: 'R80' }, { label: 'Delivery Radius', value: '5 km' }] },
    ].map(section => (
      <div key={section.title} className="card p-5">
        <h3 className="font-bold text-empire-black mb-4">{section.title}</h3>
        <div className="space-y-3">
          {section.fields.map(f => (
            <div key={f.label} className="flex items-center justify-between py-2.5 border-b border-surface-100 last:border-0">
              <span className="text-sm text-gray-500">{f.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-empire-black">{f.value}</span>
                <button className="text-gold-600 text-xs font-bold">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
    <button onClick={onLogout} className="text-empire-error font-semibold text-sm">Sign Out</button>
  </div>
);

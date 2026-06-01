import React, { useState } from 'react';
import { Clock, Star, ChevronRight, Gift, Crown, Trophy, Zap, Bell, Settings, MapPin, CreditCard, Phone, Mail, ChevronDown, ArrowLeft, TrendingUp } from 'lucide-react';
import { MOCK_ORDERS, formatPrice } from '../../data/mockData';
import { StatusBar, Badge, OrderStatusBadge, StatCard } from '../ui';

// ─── Orders Screen ─────────────────────────────────────────────────────────────
export const OrdersScreen: React.FC<{ onTrack: () => void }> = ({ onTrack }) => {
  const [tab, setTab] = useState<'active' | 'completed' | 'cancelled'>('active');
  const filterMap = { active: ['placed', 'confirmed', 'preparing', 'picked_up', 'on_way'], completed: ['delivered'], cancelled: ['cancelled'] };
  const orders = MOCK_ORDERS.filter(o => filterMap[tab].includes(o.status));

  return (
    <div className="mobile-screen flex flex-col bg-surface-100">
      <StatusBar dark />
      <div className="bg-empire-black px-5 pt-4 pb-5">
        <h1 className="font-black text-white text-xl">My Orders</h1>
      </div>
      <div className="bg-white border-b border-surface-100 flex px-5">
        {(['active', 'completed', 'cancelled'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-3.5 text-sm font-semibold capitalize transition-colors ${tab === t ? 'text-empire-black border-b-2 border-gold-500' : 'text-gray-400'}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="text-5xl mb-4">📦</span>
            <h3 className="font-bold text-empire-black">No {tab} orders</h3>
            <p className="text-gray-500 text-sm mt-1">Your orders will appear here</p>
          </div>
        ) : orders.map(order => (
          <div key={order.id} className="bg-white rounded-3xl shadow-card overflow-hidden">
            <div className="h-28 relative">
              <img src={order.restaurantImage} alt={order.restaurantName} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
              <div className="absolute inset-0 p-4 flex flex-col justify-between">
                <OrderStatusBadge status={order.status} />
                <h3 className="font-black text-white text-base">{order.restaurantName}</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-500 font-medium">{order.id}</span>
                <span className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}</span>
              </div>
              <div className="space-y-1 mb-3">
                {order.items.slice(0, 2).map(item => (
                  <div key={item.name} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.qty}x {item.name}</span>
                    <span className="font-semibold text-empire-black">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
                {order.items.length > 2 && <p className="text-xs text-gray-400">+{order.items.length - 2} more items</p>}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-surface-100">
                <span className="font-black text-empire-black">{formatPrice(order.total)}</span>
                {order.status === 'on_way' ? (
                  <button onClick={onTrack} className="btn-gold text-xs py-2 px-4">Track Order</button>
                ) : order.status === 'delivered' ? (
                  <button className="text-xs font-bold text-gold-600 flex items-center gap-1">Reorder <ChevronRight className="w-3.5 h-3.5" /></button>
                ) : order.status === 'cancelled' ? (
                  <Badge variant="error">Cancelled</Badge>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Notifications Screen ───────────────────────────────────────────────────────
export const NotificationsScreen: React.FC = () => {
  const notifs = [
    { id: 1, type: 'order', title: 'Order on the way!', body: 'Sipho is 8 minutes away with your KFC order.', time: '2 min ago', read: false, icon: '🚴' },
    { id: 2, type: 'promo', title: 'Free Delivery Weekend!', body: 'Enjoy free delivery on all orders Sat & Sun. No code needed.', time: '1 hr ago', read: false, icon: '🎉' },
    { id: 3, type: 'order', title: 'Order Delivered!', body: 'Your Nando\'s order #ORD-8756 was delivered. Enjoy your meal!', time: '2 days ago', read: true, icon: '✅' },
    { id: 4, type: 'loyalty', title: '250 Royalty Points Earned!', body: 'You earned points from your last order. 750 more to next reward.', time: '2 days ago', read: true, icon: '👑' },
    { id: 5, type: 'promo', title: 'New Restaurant Alert', body: 'Kauai just joined Empire Deliveries in Sandton. Try them today!', time: '3 days ago', read: true, icon: '🆕' },
    { id: 6, type: 'system', title: 'Payment Successful', body: 'Your payment of R304.51 was processed successfully.', time: '1 week ago', read: true, icon: '💳' },
  ];
  return (
    <div className="mobile-screen flex flex-col bg-surface-100">
      <StatusBar dark />
      <div className="bg-empire-black px-5 pt-4 pb-5 flex items-center justify-between">
        <h1 className="font-black text-white text-xl">Notifications</h1>
        <button className="text-gold-400 text-xs font-semibold">Mark all read</button>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
        {notifs.map(n => (
          <div key={n.id} className={`bg-white rounded-2xl p-4 shadow-sm flex gap-3 ${!n.read ? 'border-l-4 border-gold-500' : ''}`}>
            <span className="text-2xl flex-shrink-0">{n.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-bold ${!n.read ? 'text-empire-black' : 'text-gray-600'}`}>{n.title}</p>
                {!n.read && <div className="w-2 h-2 bg-gold-500 rounded-full flex-shrink-0 mt-1" />}
              </div>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
              <p className="text-xs text-gray-400 mt-1.5">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Loyalty Screen ────────────────────────────────────────────────────────────
export const LoyaltyScreen: React.FC = () => {
  const points = 1250;
  const nextTier = 2000;
  const pct = (points / nextTier) * 100;
  const rewards = [
    { name: 'Free Delivery', cost: 500, icon: '🚴', available: true },
    { name: 'R50 Voucher', cost: 1000, icon: '🎫', available: true },
    { name: 'Free Meal', cost: 1500, icon: '🍔', available: false },
    { name: 'VIP Status', cost: 5000, icon: '👑', available: false },
  ];

  return (
    <div className="mobile-screen flex flex-col bg-surface-100 overflow-y-auto no-scrollbar pb-8">
      <StatusBar dark />
      <div className="bg-empire-black px-5 pt-4 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Crown className="w-64 h-64 text-gold-500 absolute -right-16 -top-16" />
        </div>
        <h1 className="font-black text-white text-xl mb-6">Empire Royalty</h1>
        <div className="bg-gradient-to-br from-gold-500 via-gold-400 to-yellow-300 rounded-3xl p-5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"><Crown className="w-32 h-32 absolute -right-4 -top-4 text-empire-black" /></div>
          <p className="text-empire-black/70 text-xs font-semibold uppercase tracking-wider">Your Balance</p>
          <div className="flex items-end gap-2 mt-1">
            <span className="text-4xl font-black text-empire-black">{points.toLocaleString()}</span>
            <span className="text-empire-black/60 font-semibold text-sm mb-1">points</span>
          </div>
          <Badge variant="dark">Gold Member</Badge>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-empire-black/70 mb-1.5">
              <span>{points} points</span>
              <span>{nextTier} to Platinum</span>
            </div>
            <div className="h-2 bg-empire-black/10 rounded-full overflow-hidden">
              <div className="h-full bg-empire-black rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-5 z-10 relative space-y-5">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[{ label: 'Orders', value: '42' }, { label: 'Earned', value: '5,820' }, { label: 'Redeemed', value: '4,570' }].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-3 text-center shadow-card">
              <p className="font-black text-xl text-empire-black">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Rewards */}
        <div className="bg-white rounded-3xl p-4 shadow-card">
          <h3 className="font-bold text-sm text-empire-black mb-4">Redeem Points</h3>
          <div className="grid grid-cols-2 gap-3">
            {rewards.map(r => (
              <div key={r.name} className={`p-3 rounded-2xl border-2 ${r.available ? 'border-gold-500/30 bg-gold-500/5' : 'border-surface-200 bg-surface-50 opacity-60'}`}>
                <span className="text-2xl">{r.icon}</span>
                <p className="font-bold text-sm text-empire-black mt-1">{r.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{r.cost.toLocaleString()} pts</p>
                <button disabled={!r.available || points < r.cost} className={`mt-2 w-full py-1.5 rounded-xl text-xs font-bold transition-colors ${r.available && points >= r.cost ? 'bg-empire-black text-gold-500' : 'bg-surface-200 text-gray-400 cursor-not-allowed'}`}>
                  {r.available && points >= r.cost ? 'Redeem' : 'Not enough'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Referral */}
        <div className="bg-empire-black rounded-3xl p-5 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"><Crown className="w-40 h-40 text-gold-500 absolute -right-8 -bottom-8" /></div>
          <h3 className="font-bold text-white mb-1">Refer & Earn</h3>
          <p className="text-white/60 text-xs mb-4">Share your code and earn 500 points per referral</p>
          <div className="bg-white/10 rounded-2xl p-3 flex items-center justify-between">
            <span className="font-black text-gold-500 text-lg tracking-widest">EMPIRE42</span>
            <button className="text-xs text-white bg-gold-500/20 px-3 py-1.5 rounded-xl font-semibold">Copy</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Wallet Screen ─────────────────────────────────────────────────────────────
export const WalletScreen: React.FC = () => (
  <div className="mobile-screen flex flex-col bg-surface-100 overflow-y-auto no-scrollbar pb-8">
    <StatusBar dark />
    <div className="bg-empire-black px-5 pt-4 pb-10">
      <h1 className="font-black text-white text-xl mb-5">Empire Wallet</h1>
      <div className="bg-gradient-to-br from-empire-charcoal to-empire-black border border-gold-500/20 rounded-3xl p-5">
        <p className="text-white/60 text-xs font-medium uppercase tracking-wider">Available Balance</p>
        <p className="text-4xl font-black text-white mt-1">R<span className="text-gold-500">150.00</span></p>
        <div className="flex gap-2 mt-4">
          <button className="flex-1 py-2.5 bg-gold-500 rounded-xl text-empire-black font-bold text-sm">Add Money</button>
          <button className="flex-1 py-2.5 bg-white/10 rounded-xl text-white font-bold text-sm">Withdraw</button>
        </div>
      </div>
    </div>
    <div className="px-5 -mt-5 z-10 relative space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[{ label: 'Credits', value: 'R150.00', icon: '💰', color: '#E7FFF0' }, { label: 'Promotional', value: 'R50.00', icon: '🎁', color: '#FFF8E7' }].map(s => (
          <div key={s.label} className="rounded-2xl p-4 shadow-card" style={{ background: s.color }}>
            <span className="text-xl">{s.icon}</span>
            <p className="font-black text-empire-black text-lg mt-2">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-3xl p-4 shadow-card">
        <h3 className="font-bold text-sm text-empire-black mb-4">Recent Transactions</h3>
        {[{ label: 'Order Refund — KFC', amount: '+R50.00', date: '1 Jun 2024', type: 'credit' }, { label: 'Payment — Nando\'s', amount: '-R299.80', date: '29 May 2024', type: 'debit' }, { label: 'Referral Bonus', amount: '+R100.00', date: '28 May 2024', type: 'credit' }].map(t => (
          <div key={t.label} className="flex items-center justify-between py-3 border-b border-surface-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${t.type === 'credit' ? 'bg-green-50' : 'bg-red-50'}`}>
                <span className="text-sm">{t.type === 'credit' ? '↑' : '↓'}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-empire-black">{t.label}</p>
                <p className="text-xs text-gray-400">{t.date}</p>
              </div>
            </div>
            <span className={`font-bold text-sm ${t.type === 'credit' ? 'text-empire-success' : 'text-empire-error'}`}>{t.amount}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Profile Screen ─────────────────────────────────────────────────────────────
export const ProfileScreen: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const menuItems = [
    { icon: <MapPin className="w-4 h-4" />, label: 'Saved Addresses', sub: '3 addresses' },
    { icon: <CreditCard className="w-4 h-4" />, label: 'Payment Methods', sub: '2 cards linked' },
    { icon: <Bell className="w-4 h-4" />, label: 'Notifications', sub: 'All enabled' },
    { icon: <Settings className="w-4 h-4" />, label: 'Preferences', sub: 'Language, Dark Mode' },
    { icon: <Phone className="w-4 h-4" />, label: 'Support', sub: 'Chat, Call, Email' },
  ];
  return (
    <div className="mobile-screen flex flex-col bg-surface-100 overflow-y-auto no-scrollbar pb-8">
      <StatusBar dark />
      <div className="bg-empire-black px-5 pt-4 pb-10">
        <h1 className="font-black text-white text-xl mb-5">My Profile</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-18 h-18 rounded-3xl overflow-hidden border-2 border-gold-500" style={{ width: 72, height: 72 }}>
              <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center text-xs">✏️</button>
          </div>
          <div>
            <h2 className="font-black text-white text-lg">Thabo Nkosi</h2>
            <p className="text-white/60 text-sm">thabo.nkosi@email.com</p>
            <p className="text-white/60 text-sm">+27 82 345 6789</p>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-5 z-10 relative space-y-4">
        <div className="bg-white rounded-3xl shadow-card overflow-hidden">
          {menuItems.map((item, i) => (
            <button key={item.label} className={`w-full flex items-center gap-3 px-4 py-4 hover:bg-surface-50 transition-colors ${i < menuItems.length - 1 ? 'border-b border-surface-100' : ''}`}>
              <div className="w-9 h-9 bg-surface-100 rounded-xl flex items-center justify-center text-gray-500">{item.icon}</div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-empire-black">{item.label}</p>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          ))}
        </div>
        <button onClick={onLogout} className="w-full py-4 rounded-2xl border-2 border-empire-error text-empire-error font-bold text-sm hover:bg-empire-error hover:text-white transition-all">Sign Out</button>
        <p className="text-center text-xs text-gray-400">Empire Deliveries v2.4.1 • Made in 🇿🇦</p>
      </div>
    </div>
  );
};

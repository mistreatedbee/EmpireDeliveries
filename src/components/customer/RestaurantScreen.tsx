import React, { useState } from 'react';
import { ArrowLeft, Star, Clock, MapPin, Heart, Share2, ChevronDown, Info, Plus, Minus } from 'lucide-react';
import { RESTAURANTS, MENU_ITEMS, MenuItem, formatPrice } from '../../data/mockData';
import { StatusBar, Badge, RatingBadge, MenuItemCard } from '../ui';

// ─── Restaurant Detail Screen ──────────────────────────────────────────────────
export const RestaurantScreen: React.FC<{ restaurantId: string; onBack: () => void; onCart: () => void; cartCount: number }> = ({ restaurantId, onBack, onCart, cartCount }) => {
  const [activeTab, setActiveTab] = useState('menu');
  const [liked, setLiked] = useState(false);
  const restaurant = RESTAURANTS.find(r => r.id === restaurantId) || RESTAURANTS[0];
  const items = MENU_ITEMS.filter(m => m.restaurantId === restaurantId);
  const allItems = items.length > 0 ? items : MENU_ITEMS.slice(0, 4);
  const menuCategories = [...new Set(allItems.map(i => i.category))];

  return (
    <div className="mobile-screen flex flex-col overflow-y-auto no-scrollbar pb-24 bg-white">
      {/* Hero */}
      <div className="relative h-56">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
        <div className="absolute top-0 left-0 right-0">
          <StatusBar />
        </div>
        <div className="absolute top-14 left-5 right-5 flex items-center justify-between">
          <button onClick={onBack} className="w-9 h-9 bg-white/90 rounded-xl flex items-center justify-center shadow-card">
            <ArrowLeft className="w-5 h-5 text-empire-black" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => setLiked(!liked)} className="w-9 h-9 bg-white/90 rounded-xl flex items-center justify-center shadow-card">
              <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-empire-black'}`} />
            </button>
            <button className="w-9 h-9 bg-white/90 rounded-xl flex items-center justify-center shadow-card">
              <Share2 className="w-5 h-5 text-empire-black" />
            </button>
          </div>
        </div>
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="error">Currently Closed</Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-5 py-4 bg-white border-b border-surface-100">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-xl font-black text-empire-black leading-tight flex-1 pr-4">{restaurant.name}</h1>
          <RatingBadge rating={restaurant.rating} count={restaurant.reviewCount} />
        </div>
        <p className="text-sm text-gray-500 mb-3">{restaurant.cuisine}</p>
        <p className="text-sm text-gray-600 leading-relaxed mb-3">{restaurant.description}</p>
        <div className="flex flex-wrap gap-2">
          {restaurant.tags.map(t => <Badge key={t} variant="outline">{t}</Badge>)}
        </div>

        {/* Delivery Details */}
        <div className="mt-4 p-3 bg-surface-100 rounded-2xl">
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { icon: <Clock className="w-4 h-4 mx-auto" />, label: 'Delivery Time', value: `${restaurant.deliveryTime} min` },
              { icon: <span className="text-sm font-bold">R</span>, label: 'Delivery Fee', value: restaurant.deliveryFee === 0 ? 'Free' : `R${restaurant.deliveryFee}` },
              { icon: <MapPin className="w-4 h-4 mx-auto" />, label: 'Distance', value: restaurant.distance },
            ].map(d => (
              <div key={d.label}>
                <div className="text-gold-500 mb-1 flex justify-center">{d.icon}</div>
                <div className="text-xs font-bold text-empire-black">{d.value}</div>
                <div className="text-xs text-gray-400">{d.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Info className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-xs text-gray-500">Open today: <span className="font-semibold text-empire-black">{restaurant.operatingHours}</span></span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-100 bg-white sticky top-0 z-20">
        {['menu', 'reviews', 'info'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-3.5 text-sm font-semibold capitalize transition-colors ${activeTab === tab ? 'text-empire-black border-b-2 border-gold-500' : 'text-gray-400'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'menu' && (
        <div className="px-5 py-4">
          {restaurant.promo && (
            <div className="p-4 bg-gold-500/10 rounded-2xl border border-gold-500/20 mb-5 flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="font-bold text-sm text-empire-black">{restaurant.promo}</p>
                <p className="text-xs text-gray-500">Applied at checkout</p>
              </div>
            </div>
          )}
          {menuCategories.map(cat => (
            <div key={cat} className="mb-4">
              <h3 className="font-bold text-base text-empire-black mb-2">{cat}</h3>
              {allItems.filter(i => i.category === cat).map(item => (
                <MenuItemCard key={item.id} name={item.name} description={item.description} price={item.price} image={item.image} isPopular={item.isPopular} onAdd={() => {}} />
              ))}
            </div>
          ))}
          {allItems.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-2xl mb-2">🍽️</p>
              <p className="font-medium">Menu coming soon</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="px-5 py-4 space-y-4">
          <div className="flex items-center gap-6 p-4 bg-surface-100 rounded-2xl">
            <div className="text-center">
              <p className="text-4xl font-black text-empire-black">{restaurant.rating}</p>
              <div className="flex gap-0.5 mt-1">
                {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= Math.round(restaurant.rating) ? 'fill-gold-500 text-gold-500' : 'text-gray-200'}`} />)}
              </div>
              <p className="text-xs text-gray-500 mt-1">{restaurant.reviewCount.toLocaleString()} reviews</p>
            </div>
            <div className="flex-1 space-y-1">
              {[5,4,3,2,1].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-3">{s}</span>
                  <div className="flex-1 h-1.5 bg-surface-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gold-500 rounded-full" style={{ width: `${s === 5 ? 60 : s === 4 ? 25 : s === 3 ? 10 : s === 2 ? 3 : 2}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {[{ name: 'Sipho M.', rating: 5, text: 'Amazing food! Delivered in 22 minutes. The Zinger was still hot 🔥', date: '2 days ago' }, { name: 'Priya N.', rating: 4, text: 'Good food, packaging was neat. Driver was very professional.', date: '5 days ago' }, { name: 'James K.', rating: 5, text: 'Best KFC delivery in Sandton. Always consistent quality.', date: '1 week ago' }].map(r => (
            <div key={r.name} className="p-4 bg-white border border-surface-200 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-empire-black">{r.name}</span>
                <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'fill-gold-500 text-gold-500' : 'text-gray-200'}`} />)}</div>
              </div>
              <p className="text-sm text-gray-600">{r.text}</p>
              <p className="text-xs text-gray-400 mt-2">{r.date}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'info' && (
        <div className="px-5 py-4 space-y-4">
          {[{ label: 'Address', value: `${restaurant.address}, ${restaurant.city}` }, { label: 'Hours', value: restaurant.operatingHours }, { label: 'Minimum Order', value: `R${restaurant.minOrder}` }, { label: 'Delivery Fee', value: `R${restaurant.deliveryFee}` }].map(i => (
            <div key={i.label} className="flex justify-between py-3 border-b border-surface-100">
              <span className="text-sm text-gray-500">{i.label}</span>
              <span className="text-sm font-semibold text-empire-black text-right ml-4">{i.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 w-80">
          <button onClick={onCart} className="w-full btn-gold flex items-center justify-between px-6 py-4 shadow-gold-lg">
            <span className="w-7 h-7 bg-empire-black/10 rounded-full flex items-center justify-center text-sm font-black">{cartCount}</span>
            <span className="font-bold">View Cart</span>
            <span className="text-sm font-semibold opacity-70">R{(cartCount * 89.90).toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
};

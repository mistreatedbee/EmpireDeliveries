import React, { useState } from 'react';
import { Home, ShoppingBag, Search, Bell, User, Map } from 'lucide-react';
import { HomeScreen } from './HomeScreen';
import { SearchScreen } from './SearchScreen';
import { RestaurantScreen } from './RestaurantScreen';
import { CartScreen, CheckoutScreen, TrackingScreen } from './OrderScreens';
import { OrdersScreen, NotificationsScreen, LoyaltyScreen, WalletScreen, ProfileScreen } from './ProfileScreens';

type CustomerRoute =
  | 'home' | 'search' | 'orders' | 'notifications' | 'loyalty' | 'wallet' | 'profile'
  | 'restaurant' | 'cart' | 'checkout' | 'tracking';

const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'orders', icon: ShoppingBag, label: 'Orders' },
  { id: 'notifications', icon: Bell, label: 'Alerts' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export const CustomerApp: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [route, setRoute] = useState<CustomerRoute>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('r1');
  const [cartCount, setCartCount] = useState(2);
  const mainRoutes = ['home', 'search', 'orders', 'notifications', 'profile'];

  const go = (r: CustomerRoute) => setRoute(r);

  const renderScreen = () => {
    switch (route) {
      case 'home': return <HomeScreen onRestaurant={(id) => { setSelectedRestaurant(id); go('restaurant'); }} onSearch={() => go('search')} />;
      case 'search': return <SearchScreen onBack={() => go('home')} onRestaurant={(id) => { setSelectedRestaurant(id); go('restaurant'); }} />;
      case 'restaurant': return <RestaurantScreen restaurantId={selectedRestaurant} onBack={() => go('home')} onCart={() => go('cart')} cartCount={cartCount} />;
      case 'cart': return <CartScreen onBack={() => go('restaurant')} onCheckout={() => go('checkout')} />;
      case 'checkout': return <CheckoutScreen onBack={() => go('cart')} onPlaceOrder={() => go('tracking')} />;
      case 'tracking': return <TrackingScreen onBack={() => go('orders')} />;
      case 'orders': return <OrdersScreen onTrack={() => go('tracking')} />;
      case 'notifications': return <NotificationsScreen />;
      case 'loyalty': return <LoyaltyScreen />;
      case 'wallet': return <WalletScreen />;
      case 'profile': return <ProfileScreen onLogout={onLogout} />;
      default: return <HomeScreen onRestaurant={(id) => { setSelectedRestaurant(id); go('restaurant'); }} onSearch={() => go('search')} />;
    }
  };

  const showNav = mainRoutes.includes(route);

  return (
    <div className="mobile-screen relative">
      {renderScreen()}
      {showNav && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-surface-200 flex items-center justify-around px-2 pt-2 pb-5 z-50 shadow-lift">
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
            const active = route === id;
            return (
              <button key={id} onClick={() => go(id as CustomerRoute)} className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all">
                <div className={`relative transition-all duration-200 ${active ? 'scale-110' : ''}`}>
                  <Icon className={`w-6 h-6 ${active ? 'text-empire-black' : 'text-gray-400'}`} strokeWidth={active ? 2.5 : 1.75} />
                  {id === 'orders' && cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold-500 rounded-full text-empire-black text-xs font-black flex items-center justify-center">{cartCount}</span>
                  )}
                  {id === 'notifications' && (
                    <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-empire-error rounded-full border-2 border-white" />
                  )}
                </div>
                <span className={`text-xs font-semibold transition-colors ${active ? 'text-empire-black' : 'text-gray-400'}`}>{label}</span>
                {active && <div className="w-1 h-1 bg-gold-500 rounded-full" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

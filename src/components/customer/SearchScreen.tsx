import React, { useState } from 'react';
import { Search, X, Filter, Star, Clock, MapPin, TrendingUp, ChevronRight } from 'lucide-react';
import { RESTAURANTS } from '../../data/mockData';
import { StatusBar, RestaurantCard, Badge } from '../ui';

export const SearchScreen: React.FC<{ onBack: () => void; onRestaurant: (id: string) => void }> = ({ onBack, onRestaurant }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string[]>([]);
  const trending = ['Zinger Burger', 'Peri-Peri Chicken', 'Triple Decker Pizza', 'Steers Big Crunch', 'Spur Ribs'];
  const recent = ['KFC Sandton', "Nando's Rosebank", 'Debonairs Menlyn'];
  const filters = ['Fast Food', 'Pizza', 'Burgers', 'Chicken', 'Groceries', 'Under R20 Delivery', 'Open Now', 'Top Rated'];
  const results = query.length > 1 ? RESTAURANTS.filter(r => r.name.toLowerCase().includes(query.toLowerCase()) || r.cuisine.toLowerCase().includes(query.toLowerCase())) : [];

  return (
    <div className="mobile-screen flex flex-col bg-white">
      <StatusBar dark={false} />
      {/* Search Header */}
      <div className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input autoFocus type="text" placeholder="Search restaurants or food..." value={query} onChange={e => setQuery(e.target.value)} className="input-field pl-11 pr-10" />
            {query && <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-gray-400" /></button>}
          </div>
          <button onClick={onBack} className="text-sm font-semibold text-gold-600">Cancel</button>
        </div>
        {/* Filter Button */}
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 mt-3 text-sm font-medium text-gray-600">
          <Filter className="w-4 h-4" />
          Filters
          {activeFilter.length > 0 && <Badge variant="gold">{activeFilter.length}</Badge>}
        </button>
      </div>

      {/* Filter Chips */}
      {showFilters && (
        <div className="px-5 pb-4">
          <div className="flex flex-wrap gap-2">
            {filters.map(f => (
              <button key={f} onClick={() => setActiveFilter(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${activeFilter.includes(f) ? 'bg-empire-black text-white border-empire-black' : 'bg-white text-gray-600 border-surface-300'}`}>
                {f}
              </button>
            ))}
          </div>
          {/* Price & Distance Sliders mock */}
          <div className="mt-4 space-y-3">
            {[{ label: 'Max Delivery Fee', value: 'R0 – R50' }, { label: 'Max Distance', value: '0 – 10 km' }, { label: 'Min Rating', value: '3.0+' }].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">{s.label}</span>
                <span className="text-xs font-bold text-empire-black bg-surface-100 px-2.5 py-1 rounded-full">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-8">
        {!query ? (
          <>
            {/* Trending */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Trending Searches</h3>
              <div className="flex flex-wrap gap-2">
                {trending.map(t => (
                  <button key={t} onClick={() => setQuery(t)} className="flex items-center gap-1.5 px-3 py-2 bg-surface-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gold-500/10 hover:text-gold-700 transition-colors">
                    <TrendingUp className="w-3.5 h-3.5 text-gold-500" />{t}
                  </button>
                ))}
              </div>
            </div>
            {/* Recent */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Recent Searches</h3>
              {recent.map(r => (
                <button key={r} onClick={() => setQuery(r)} className="w-full flex items-center justify-between py-3 border-b border-surface-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-surface-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                    <span className="text-sm font-medium text-empire-black">{r}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </button>
              ))}
            </div>
          </>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-bold text-empire-black">No results found</h3>
            <p className="text-gray-500 text-sm mt-2">Try a different search term or browse categories</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-4">{results.length} results for <span className="font-semibold text-empire-black">"{query}"</span></p>
            <div className="space-y-4">
              {results.map(r => <RestaurantCard key={r.id} {...r} reviewCount={r.reviewCount} onClick={() => onRestaurant(r.id)} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

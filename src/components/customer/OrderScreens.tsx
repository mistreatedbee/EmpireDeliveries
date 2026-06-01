import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus, Trash2, Tag, ChevronRight, CreditCard, MapPin, Clock } from 'lucide-react';
import { StatusBar, Badge, OrderProgressSteps } from '../ui';
import { formatPrice } from '../../data/mockData';

// ─── Cart Screen ───────────────────────────────────────────────────────────────
export const CartScreen: React.FC<{ onBack: () => void; onCheckout: () => void }> = ({ onBack, onCheckout }) => {
  const [items, setItems] = useState([
    { id: 'm1', name: 'Zinger Tower Burger', price: 89.90, qty: 1, image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=200', restaurant: 'KFC Sandton City' },
    { id: 'm2', name: '8-Piece Streetwise Bucket', price: 149.90, qty: 1, image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=200', restaurant: 'KFC Sandton City' },
  ]);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = 15;
  const serviceFee = 9.99;
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const vat = (subtotal - discount + deliveryFee + serviceFee) * 0.15;
  const total = subtotal - discount + deliveryFee + serviceFee + vat;

  const updateQty = (id: string, delta: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  return (
    <div className="mobile-screen flex flex-col bg-surface-100">
      <StatusBar dark={false} />
      <div className="px-5 py-4 bg-white border-b border-surface-100 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 bg-surface-100 rounded-xl flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-empire-black" />
        </button>
        <div>
          <h1 className="font-black text-empire-black text-lg">Your Cart</h1>
          <p className="text-xs text-gray-500">KFC Sandton City</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-36">
        {/* Items */}
        <div className="bg-white m-4 rounded-3xl overflow-hidden shadow-card">
          {items.map((item, idx) => (
            <div key={item.id} className={`flex items-center gap-3 p-4 ${idx < items.length - 1 ? 'border-b border-surface-100' : ''}`}>
              <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-empire-black truncate">{item.name}</p>
                <p className="font-bold text-sm text-empire-black mt-0.5">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 bg-surface-100 rounded-full flex items-center justify-center">
                  {item.qty === 1 ? <Trash2 className="w-3.5 h-3.5 text-empire-error" /> : <Minus className="w-3.5 h-3.5 text-empire-black" />}
                </button>
                <span className="w-5 text-center font-bold text-sm">{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 bg-empire-black rounded-full flex items-center justify-center">
                  <Plus className="w-3.5 h-3.5 text-gold-500" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon */}
        <div className="mx-4 mb-4">
          <div className="bg-white rounded-3xl p-4 shadow-card">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-gold-500 flex-shrink-0" />
              <input type="text" placeholder="Enter promo code" value={coupon} onChange={e => setCoupon(e.target.value)} className="flex-1 text-sm font-medium outline-none" />
              <button onClick={() => { if (coupon.length > 0) setCouponApplied(true); }} className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors ${coupon.length > 0 ? 'bg-empire-black text-white' : 'bg-surface-100 text-gray-400'}`}>
                {couponApplied ? '✓ Applied' : 'Apply'}
              </button>
            </div>
            {couponApplied && <p className="text-xs text-empire-success font-semibold mt-2">10% discount applied!</p>}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mx-4 mb-4 bg-white rounded-3xl p-4 shadow-card space-y-3">
          <h3 className="font-bold text-sm text-empire-black">Order Summary</h3>
          {[
            { label: 'Subtotal', value: formatPrice(subtotal) },
            ...(discount > 0 ? [{ label: 'Discount (10%)', value: `-${formatPrice(discount)}`, color: 'text-empire-success' }] : []),
            { label: 'Delivery Fee', value: formatPrice(deliveryFee) },
            { label: 'Service Fee', value: formatPrice(serviceFee) },
            { label: 'VAT (15%)', value: formatPrice(vat) },
          ].map(row => (
            <div key={row.label} className="flex justify-between text-sm">
              <span className="text-gray-500">{row.label}</span>
              <span className={`font-semibold ${(row as any).color || 'text-empire-black'}`}>{row.value}</span>
            </div>
          ))}
          <div className="h-px bg-surface-200" />
          <div className="flex justify-between">
            <span className="font-bold text-empire-black">Total</span>
            <span className="font-black text-empire-black text-lg">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white border-t border-surface-100 p-5">
        <button onClick={onCheckout} className="btn-gold w-full flex items-center justify-between px-6 py-4">
          <span className="font-bold">Proceed to Checkout</span>
          <span className="font-black">{formatPrice(total)}</span>
        </button>
      </div>
    </div>
  );
};

// ─── Checkout Screen ───────────────────────────────────────────────────────────
export const CheckoutScreen: React.FC<{ onBack: () => void; onPlaceOrder: () => void }> = ({ onBack, onPlaceOrder }) => {
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [instructions, setInstructions] = useState('');
  const payments = [
    { id: 'card', label: 'Credit / Debit Card', sub: '**** 4532', icon: '💳' },
    { id: 'ozow', label: 'Ozow (EFT)', sub: 'Instant EFT', icon: '🏦' },
    { id: 'payfast', label: 'PayFast', sub: 'SA Gateway', icon: '⚡' },
    { id: 'apple', label: 'Apple Pay', sub: 'Touch ID', icon: '🍎' },
    { id: 'google', label: 'Google Pay', sub: 'Tap to pay', icon: 'G' },
    { id: 'wallet', label: 'Empire Wallet', sub: 'Balance: R150.00', icon: '👑' },
  ];

  return (
    <div className="mobile-screen flex flex-col bg-surface-100">
      <StatusBar dark={false} />
      <div className="px-5 py-4 bg-white border-b border-surface-100 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 bg-surface-100 rounded-xl flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-empire-black" />
        </button>
        <h1 className="font-black text-empire-black text-lg">Checkout</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-36 space-y-4 p-4">
        {/* Delivery Address */}
        <div className="bg-white rounded-3xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-empire-black">Delivery Address</h3>
            <button className="text-gold-600 text-xs font-bold">Change</button>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-gold-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-gold-500" />
            </div>
            <div>
              <p className="font-semibold text-sm text-empire-black">Home</p>
              <p className="text-xs text-gray-500 mt-0.5">14 Rivonia Rd, Sandton, Johannesburg, 2196</p>
            </div>
          </div>
          <textarea value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="Delivery instructions (gate code, floor, etc.)" className="input-field mt-3 h-16 resize-none text-xs" />
        </div>

        {/* Estimated Time */}
        <div className="bg-white rounded-3xl p-4 shadow-card flex items-center gap-3">
          <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-empire-success" />
          </div>
          <div>
            <p className="font-bold text-sm text-empire-black">Estimated Delivery</p>
            <p className="text-xs text-gray-500 mt-0.5">20 – 30 minutes • Arriving by 2:48 PM</p>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-3xl p-4 shadow-card">
          <h3 className="font-bold text-sm text-empire-black mb-3">Payment Method</h3>
          <div className="space-y-2">
            {payments.map(p => (
              <button key={p.id} onClick={() => setSelectedPayment(p.id)} className={`w-full flex items-center gap-3 p-3 rounded-2xl border transition-all ${selectedPayment === p.id ? 'border-gold-500 bg-gold-500/5' : 'border-surface-200 hover:border-surface-300'}`}>
                <span className="w-9 h-9 bg-surface-100 rounded-xl flex items-center justify-center text-sm font-bold">{p.icon}</span>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm text-empire-black">{p.label}</p>
                  <p className="text-xs text-gray-500">{p.sub}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedPayment === p.id ? 'border-gold-500 bg-gold-500' : 'border-surface-300'}`}>
                  {selectedPayment === p.id && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-3xl p-4 shadow-card">
          <h3 className="font-bold text-sm text-empire-black mb-3">Order Summary</h3>
          {[{ label: 'KFC Sandton City', items: '2 items' }, { label: 'Subtotal', value: 'R239.80' }, { label: 'Delivery Fee', value: 'R15.00' }, { label: 'Service Fee', value: 'R9.99' }, { label: 'VAT (15%)', value: 'R39.72' }].map(row => (
            <div key={row.label} className="flex justify-between text-sm py-1.5 border-b border-surface-50 last:border-0">
              <span className="text-gray-500">{row.label}</span>
              <span className="font-semibold text-empire-black">{(row as any).value || (row as any).items}</span>
            </div>
          ))}
          <div className="flex justify-between mt-3 pt-3 border-t border-surface-200">
            <span className="font-black text-empire-black">Total</span>
            <span className="font-black text-empire-black text-lg">R304.51</span>
          </div>
        </div>
      </div>

      {/* Place Order */}
      <div className="fixed bottom-0 left-0 right-0 max-w-sm mx-auto bg-white border-t border-surface-100 p-5">
        <button onClick={onPlaceOrder} className="btn-gold w-full flex items-center justify-between px-6 py-4">
          <span className="font-bold">Place Order</span>
          <span className="font-black">R304.51</span>
        </button>
        <p className="text-center text-xs text-gray-400 mt-2">By placing this order you agree to our Terms & Conditions</p>
      </div>
    </div>
  );
};

// ─── Order Tracking Screen ─────────────────────────────────────────────────────
export const TrackingScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [mapExpanded, setMapExpanded] = useState(false);
  const driver = { name: 'Sipho Dlamini', rating: 4.8, vehicle: 'Toyota Corolla', plate: 'JHB 123 GP', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100' };

  return (
    <div className="mobile-screen flex flex-col bg-white">
      <StatusBar dark />
      {/* Map Area */}
      <div className="relative" style={{ height: mapExpanded ? '60vh' : '45vh' }} onClick={() => setMapExpanded(!mapExpanded)}>
        <img src="https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Map" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
        {/* Back */}
        <div className="absolute top-4 left-4">
          <button onClick={(e) => { e.stopPropagation(); onBack(); }} className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-card">
            <ArrowLeft className="w-5 h-5 text-empire-black" />
          </button>
        </div>
        {/* ETA Bubble */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2">
          <div className="bg-empire-black rounded-2xl px-5 py-3 text-center shadow-lift">
            <p className="text-gold-500 text-2xl font-black">8 min</p>
            <p className="text-white/70 text-xs">Estimated arrival</p>
          </div>
        </div>
        {/* Driver Pin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce-subtle">
          <div className="relative">
            <div className="w-12 h-12 bg-gold-500 rounded-full border-4 border-white shadow-gold overflow-hidden">
              <img src={driver.avatar} alt={driver.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-gold-500 rotate-45 border-r-2 border-b-2 border-white" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-5 bg-white space-y-5">
        {/* Status */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <Badge variant="gold">On the Way</Badge>
              <h2 className="font-black text-empire-black text-xl mt-1">Order #ORD-8821</h2>
              <p className="text-gray-500 text-sm">KFC Sandton City</p>
            </div>
          </div>
          <OrderProgressSteps currentStatus="on_way" />
        </div>

        {/* Driver Card */}
        <div className="p-4 bg-surface-100 rounded-3xl flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-gold-500 flex-shrink-0">
            <img src={driver.avatar} alt={driver.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <p className="font-black text-empire-black">{driver.name}</p>
            <p className="text-xs text-gray-500">{driver.vehicle} • {driver.plate}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-gold-500 text-xs font-bold">★ {driver.rating}</span>
              <span className="text-gray-300 text-xs">•</span>
              <span className="text-xs text-gray-500">1,249 deliveries</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-card">
              <span className="text-lg">📞</span>
            </button>
            <button className="w-10 h-10 bg-empire-black rounded-xl flex items-center justify-center shadow-card">
              <span className="text-lg">💬</span>
            </button>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white border border-surface-200 rounded-3xl p-4">
          <h3 className="font-bold text-sm text-empire-black mb-4">Delivery Timeline</h3>
          {[
            { time: '14:18', label: 'Order Placed', done: true, current: false },
            { time: '14:20', label: 'Restaurant Confirmed', done: true, current: false },
            { time: '14:28', label: 'Being Prepared', done: true, current: false },
            { time: '14:35', label: 'Picked Up by Driver', done: true, current: false },
            { time: '~14:43', label: 'Arriving at Your Location', done: false, current: true },
            { time: '~14:45', label: 'Delivered', done: false, current: false },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
              <div className="flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-gold-500' : step.current ? 'bg-empire-black animate-pulse-gold' : 'bg-surface-200'}`}>
                  {step.done && <span className="text-white text-xs">✓</span>}
                  {step.current && <div className="w-2 h-2 bg-gold-500 rounded-full" />}
                </div>
                {i < 5 && <div className={`w-0.5 h-6 mt-1 ${step.done ? 'bg-gold-500' : 'bg-surface-200'}`} />}
              </div>
              <div className="flex-1 -mt-0.5">
                <p className={`text-sm font-semibold ${step.current ? 'text-empire-black' : step.done ? 'text-gray-600' : 'text-gray-400'}`}>{step.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{step.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

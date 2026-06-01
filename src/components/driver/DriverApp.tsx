import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, DollarSign, Star, Phone, Navigation, CheckCircle, Camera, TrendingUp, Wallet, ChevronRight, Bell, ToggleLeft, ToggleRight, Package, Bike } from 'lucide-react';
import { StatusBar, Badge, EmpireLogo, StatCard } from '../ui';

// ─── Driver Auth ───────────────────────────────────────────────────────────────
export const DriverLoginScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  return (
    <div className="mobile-screen flex flex-col overflow-auto bg-empire-black">
      <StatusBar dark />
      <div className="flex-1 flex flex-col">
        <div className="px-6 pt-8 pb-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"><Bike className="w-64 h-64 text-gold-500 absolute -right-16 -top-8" /></div>
          <EmpireLogo size={44} />
          <h1 className="text-2xl font-black text-white mt-6">Drive with Empire</h1>
          <p className="text-white/60 text-sm mt-1">Earn on your own schedule. Be your own boss.</p>
          <div className="flex gap-4 mt-6">
            {['R250 avg/day', '4.8★ avg rating', '15+ cities'].map(s => (
              <div key={s} className="text-center">
                <p className="text-gold-500 font-black text-sm">{s.split(' ')[0]}</p>
                <p className="text-white/50 text-xs">{s.split(' ').slice(1).join(' ')}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 bg-white rounded-t-3xl px-6 pt-6 pb-8">
          <div className="flex bg-surface-100 rounded-2xl p-1 mb-5">
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => setTab(m)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === m ? 'bg-white text-empire-black shadow-card' : 'text-gray-500'}`}>
                {m === 'login' ? 'Login' : 'Sign Up'}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {tab === 'register' && <input type="text" placeholder="Full name" className="input-field" />}
            <input type="email" placeholder="Email address" className="input-field" />
            <input type="password" placeholder="Password" className="input-field" />
            {tab === 'register' && <input type="tel" placeholder="Phone number" className="input-field" />}
          </div>
          <button onClick={onDone} className="btn-gold w-full mt-5">{tab === 'login' ? 'Login' : 'Continue'}</button>
          {tab === 'register' && (
            <div className="mt-5 p-4 bg-surface-100 rounded-2xl">
              <h4 className="font-bold text-sm text-empire-black mb-3">Documents Required</h4>
              <div className="space-y-2">
                {['South African ID or Passport', "Valid Driver's License", 'Vehicle Registration', 'Proof of Address'].map(d => (
                  <div key={d} className="flex items-center gap-2 text-xs text-gray-500"><span className="text-gold-500">✓</span>{d}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Driver Dashboard ──────────────────────────────────────────────────────────
export const DriverDashboard: React.FC<{ onDelivery: () => void; onLogout: () => void }> = ({ onDelivery, onLogout }) => {
  const [online, setOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'earnings' | 'wallet' | 'profile'>('dashboard');

  const renderTab = () => {
    if (activeTab === 'earnings') return <DriverEarnings />;
    if (activeTab === 'wallet') return <DriverWallet />;
    if (activeTab === 'profile') return <DriverProfile onLogout={onLogout} />;
    return (
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 space-y-5 p-5">
        {/* Online Toggle */}
        <div className={`rounded-3xl p-5 transition-colors duration-300 ${online ? 'bg-empire-success' : 'bg-gray-400'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-black text-white text-lg">{online ? "You're Online" : "You're Offline"}</p>
              <p className="text-white/80 text-sm">{online ? 'Ready to receive deliveries' : 'Toggle to start earning'}</p>
            </div>
            <button onClick={() => setOnline(!online)} className="relative">
              <div className={`w-14 h-8 rounded-full transition-colors ${online ? 'bg-white/20' : 'bg-black/20'}`}>
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all duration-300 ${online ? 'left-7' : 'left-1'}`} />
              </div>
            </button>
          </div>
          {online && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[{ label: 'Today', value: 'R480' }, { label: 'Deliveries', value: '6' }, { label: 'Acceptance', value: '94%' }].map(s => (
                <div key={s.label} className="bg-white/10 rounded-2xl p-3 text-center">
                  <p className="font-black text-white text-xl">{s.value}</p>
                  <p className="text-white/70 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Delivery Request */}
        {online && (
          <div className="bg-white rounded-3xl shadow-card overflow-hidden border-2 border-gold-500 animate-pulse-gold">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="gold">New Request</Badge>
                <span className="text-sm font-bold text-empire-error">Expires in 0:28</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden">
                  <img src="https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=100" alt="KFC" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-empire-black">KFC Sandton City</p>
                  <p className="text-xs text-gray-500">1 order • 2 items</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[{ label: 'Distance', value: '3.2 km' }, { label: 'Payout', value: 'R45' }, { label: 'ETA', value: '18 min' }].map(s => (
                  <div key={s.label} className="bg-surface-100 rounded-xl p-2 text-center">
                    <p className="font-bold text-sm text-empire-black">{s.value}</p>
                    <p className="text-xs text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-3 rounded-2xl border-2 border-surface-300 text-gray-500 font-semibold text-sm">Decline</button>
                <button onClick={onDelivery} className="flex-1 py-3 rounded-2xl bg-empire-success text-white font-bold text-sm">Accept</button>
              </div>
            </div>
            <div className="h-1 bg-surface-200"><div className="h-full bg-gold-500 animate-[shrink_28s_linear_forwards]" style={{ width: '60%' }} /></div>
          </div>
        )}

        {/* Map Preview */}
        <div className="rounded-3xl overflow-hidden shadow-card h-48 relative">
          <img src="https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Map" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-3 right-3">
            <Badge variant="dark">Sandton, JHB</Badge>
          </div>
        </div>

        {/* Recent Deliveries */}
        <div>
          <h3 className="font-bold text-empire-black mb-3">Recent Deliveries</h3>
          {[{ name: 'Nando\'s Rosebank', time: '14:22', earn: 'R38', rating: '5.0', status: 'delivered' }, { name: 'Steers Midrand', time: '12:08', earn: 'R42', rating: '4.8', status: 'delivered' }].map(d => (
            <div key={d.name} className="bg-white rounded-2xl p-3 shadow-sm mb-2 flex items-center gap-3">
              <div className="w-10 h-10 bg-surface-100 rounded-xl flex items-center justify-center">
                <Bike className="w-5 h-5 text-empire-black" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-empire-black">{d.name}</p>
                <p className="text-xs text-gray-400">{d.time} · ★ {d.rating}</p>
              </div>
              <span className="font-bold text-empire-success text-sm">{d.earn}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mobile-screen flex flex-col bg-surface-100">
      <StatusBar dark />
      <div className="bg-empire-black px-5 pt-4 pb-4 flex items-center justify-between">
        <div>
          <p className="text-white/60 text-xs">Welcome back,</p>
          <h1 className="font-black text-white text-lg">Sipho Dlamini</h1>
        </div>
        <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-gold-500">
          <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100" alt="Driver" className="w-full h-full object-cover" />
        </div>
      </div>
      {renderTab()}

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-surface-200 flex items-center justify-around px-2 pt-2 pb-5 z-50">
        {[{ id: 'dashboard', icon: <Bike className="w-6 h-6" />, label: 'Dashboard' }, { id: 'earnings', icon: <TrendingUp className="w-6 h-6" />, label: 'Earnings' }, { id: 'wallet', icon: <Wallet className="w-6 h-6" />, label: 'Wallet' }, { id: 'profile', icon: <Star className="w-6 h-6" />, label: 'Profile' }].map(item => {
          const active = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id as any)} className="flex flex-col items-center gap-1">
              <div className={`${active ? 'text-empire-black' : 'text-gray-400'} transition-colors`}>{item.icon}</div>
              <span className={`text-xs font-semibold ${active ? 'text-empire-black' : 'text-gray-400'}`}>{item.label}</span>
              {active && <div className="w-1 h-1 bg-gold-500 rounded-full" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Active Delivery Screen ─────────────────────────────────────────────────────
export const ActiveDeliveryScreen: React.FC<{ onBack: () => void; onComplete: () => void }> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<'pickup' | 'deliver'>('pickup');
  return (
    <div className="mobile-screen flex flex-col bg-white">
      <StatusBar dark />
      <div className="relative h-64">
        <img src="https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Map" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
        <button onClick={onBack} className="absolute top-4 left-4 w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-card">
          <ArrowLeft className="w-5 h-5 text-empire-black" />
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className={`px-5 py-2.5 rounded-2xl font-bold text-sm shadow-lift ${step === 'pickup' ? 'bg-empire-warning text-white' : 'bg-empire-success text-white'}`}>
            {step === 'pickup' ? '🏪 Head to Restaurant' : '🏠 Head to Customer'}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
        <div className="flex items-center gap-3 p-4 bg-surface-100 rounded-3xl">
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{step === 'pickup' ? 'Pickup From' : 'Deliver To'}</p>
            <p className="font-bold text-empire-black mt-0.5">{step === 'pickup' ? 'KFC Sandton City' : 'Thabo Nkosi'}</p>
            <p className="text-xs text-gray-500">{step === 'pickup' ? 'Sandton City Mall, Ground Floor' : '14 Rivonia Rd, Sandton, 2196'}</p>
          </div>
          <button className="w-10 h-10 bg-empire-black rounded-xl flex items-center justify-center">
            <Navigation className="w-5 h-5 text-gold-500" />
          </button>
        </div>

        {step === 'pickup' ? (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-empire-black">Order Items</h3>
            {['Zinger Tower Burger x1', '8-Piece Bucket x1'].map(item => (
              <div key={item} className="flex items-center gap-3 p-3 bg-white border border-surface-200 rounded-2xl">
                <CheckCircle className="w-5 h-5 text-surface-300" />
                <span className="text-sm font-medium text-empire-black">{item}</span>
              </div>
            ))}
            <button onClick={() => setStep('deliver')} className="btn-gold w-full py-4">I've Picked Up the Order</button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-4 bg-white border border-surface-200 rounded-3xl">
              <p className="text-xs text-gray-500 mb-1">Customer</p>
              <div className="flex items-center justify-between">
                <p className="font-bold text-empire-black">Thabo Nkosi</p>
                <div className="flex gap-2">
                  <button className="w-9 h-9 bg-surface-100 rounded-xl flex items-center justify-center"><Phone className="w-4 h-4 text-empire-black" /></button>
                  <button className="w-9 h-9 bg-empire-black rounded-xl flex items-center justify-center"><span className="text-gold-500 text-sm">💬</span></button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Note: Please ring the doorbell</p>
            </div>
            <div className="p-4 bg-surface-100 rounded-2xl">
              <p className="text-xs font-medium text-gray-500 mb-2">Proof of Delivery</p>
              <button className="w-full py-3 border-2 border-dashed border-surface-300 rounded-2xl flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
                <Camera className="w-5 h-5" /> Take Photo
              </button>
            </div>
            <button onClick={onComplete} className="btn-gold w-full py-4">Confirm Delivery</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Driver Earnings ───────────────────────────────────────────────────────────
const DriverEarnings: React.FC = () => {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('week');
  const data = { today: { earn: 'R480', trips: 6, hrs: '5h 20m' }, week: { earn: 'R2,840', trips: 38, hrs: '34h 10m' }, month: { earn: 'R11,200', trips: 152, hrs: '136h' } };
  const d = data[period];
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5 pb-24">
      <div className="flex bg-surface-100 rounded-2xl p-1">
        {(['today', 'week', 'month'] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)} className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${period === p ? 'bg-white text-empire-black shadow-card' : 'text-gray-400'}`}>{p}</button>
        ))}
      </div>
      <div className="bg-gradient-to-br from-empire-black to-empire-charcoal rounded-3xl p-5">
        <p className="text-white/60 text-xs uppercase tracking-wider">Total Earnings</p>
        <p className="text-4xl font-black text-white mt-1">{d.earn}</p>
        <div className="flex gap-6 mt-4">
          {[{ label: 'Trips', value: d.trips }, { label: 'Hours', value: d.hrs }].map(s => (
            <div key={s.label}>
              <p className="font-black text-gold-500 text-xl">{s.value}</p>
              <p className="text-white/60 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-3xl p-4 shadow-card">
        <h3 className="font-bold text-sm text-empire-black mb-3">Daily Breakdown</h3>
        {[{ day: 'Monday', trips: 6, earn: 'R485' }, { day: 'Tuesday', trips: 5, earn: 'R390' }, { day: 'Wednesday', trips: 8, earn: 'R620' }, { day: 'Thursday', trips: 4, earn: 'R310' }, { day: 'Friday', trips: 9, earn: 'R720' }].map(row => (
          <div key={row.day} className="flex items-center justify-between py-2.5 border-b border-surface-100 last:border-0">
            <span className="text-sm text-gray-600">{row.day}</span>
            <span className="text-xs text-gray-400">{row.trips} trips</span>
            <span className="font-bold text-sm text-empire-black">{row.earn}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DriverWallet: React.FC = () => (
  <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4 pb-24">
    <div className="bg-gradient-to-br from-gold-500 to-yellow-300 rounded-3xl p-5">
      <p className="text-empire-black/70 text-xs uppercase tracking-wider">Available Balance</p>
      <p className="text-4xl font-black text-empire-black mt-1">R2,840</p>
      <button className="mt-4 bg-empire-black text-gold-500 font-bold text-sm px-6 py-2.5 rounded-2xl">Withdraw to Bank</button>
    </div>
    <div className="bg-white rounded-3xl p-4 shadow-card">
      <h3 className="font-bold text-sm text-empire-black mb-3">Bank Account</h3>
      <div className="flex items-center gap-3 p-3 bg-surface-100 rounded-2xl">
        <div className="w-10 h-10 bg-empire-black rounded-xl flex items-center justify-center text-gold-500 font-bold text-sm">FNB</div>
        <div>
          <p className="font-semibold text-sm text-empire-black">FNB Cheque Account</p>
          <p className="text-xs text-gray-400">**** **** 4892</p>
        </div>
        <button className="ml-auto text-xs text-gold-600 font-bold">Change</button>
      </div>
    </div>
  </div>
);

const DriverProfile: React.FC<{ onLogout: () => void }> = ({ onLogout }) => (
  <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4 pb-24">
    <div className="bg-white rounded-3xl p-4 shadow-card flex items-center gap-4">
      <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-gold-500">
        <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200" alt="Driver" className="w-full h-full object-cover" />
      </div>
      <div>
        <h2 className="font-black text-empire-black">Sipho Dlamini</h2>
        <p className="text-xs text-gray-500">Toyota Corolla • JHB 123 GP</p>
        <div className="flex items-center gap-1 mt-1"><Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" /><span className="text-sm font-bold">4.8</span><span className="text-xs text-gray-400">(1,249 ratings)</span></div>
      </div>
    </div>
    <div className="bg-white rounded-3xl shadow-card overflow-hidden">
      {['Documents', 'Vehicle Details', 'Support', 'Settings'].map((item, i, arr) => (
        <button key={item} className={`w-full flex items-center justify-between px-4 py-4 hover:bg-surface-50 transition-colors ${i < arr.length - 1 ? 'border-b border-surface-100' : ''}`}>
          <span className="font-medium text-sm text-empire-black">{item}</span>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </button>
      ))}
    </div>
    <button onClick={onLogout} className="w-full py-4 rounded-2xl border-2 border-empire-error text-empire-error font-bold text-sm">Sign Out</button>
  </div>
);

// ─── Driver App Wrapper ────────────────────────────────────────────────────────
export const DriverApp: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [route, setRoute] = useState<'login' | 'dashboard' | 'delivery' | 'complete'>('login');
  if (route === 'login') return <DriverLoginScreen onDone={() => setRoute('dashboard')} />;
  if (route === 'delivery') return <ActiveDeliveryScreen onBack={() => setRoute('dashboard')} onComplete={() => setRoute('complete')} />;
  if (route === 'complete') return (
    <div className="mobile-screen flex flex-col items-center justify-center bg-white p-8 text-center">
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-scale-in">
        <CheckCircle className="w-14 h-14 text-empire-success" strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-black text-empire-black">Delivery Complete!</h2>
      <p className="text-gray-500 mt-2">You earned <span className="font-black text-empire-success">R45</span> for this delivery</p>
      <button onClick={() => setRoute('dashboard')} className="btn-gold mt-8 px-10">Back to Dashboard</button>
    </div>
  );
  return <DriverDashboard onDelivery={() => setRoute('delivery')} onLogout={onLogout} />;
};

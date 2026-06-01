import React, { useState, useEffect } from 'react';
import { Crown, ChevronRight, MapPin, Bike, Package, ShoppingBag, Pill } from 'lucide-react';
import { EmpireLogoWhite, EmpireLogo, StatusBar } from '../ui';

// ─── Splash Screen ─────────────────────────────────────────────────────────────
export const SplashScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setProgress(p => { if (p >= 100) { clearInterval(t); setTimeout(onDone, 300); return 100; } return p + 2; }), 30);
    return () => clearInterval(t);
  }, [onDone]);
  return (
    <div className="mobile-screen flex flex-col items-center justify-center bg-empire-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gold-500/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="animate-scale-in">
          <div className="relative">
            <div className="absolute inset-0 bg-gold-500/30 rounded-3xl blur-2xl animate-pulse-gold scale-150" />
            <div className="relative w-24 h-24 bg-gold-500 rounded-3xl flex items-center justify-center shadow-gold-lg">
              <Crown className="w-14 h-14 text-empire-black" strokeWidth={1.5} />
            </div>
          </div>
        </div>
        <div className="animate-fade-in text-center" style={{ animationDelay: '0.3s' }}>
          <h1 className="text-4xl font-black text-white tracking-tight">EMPIRE</h1>
          <p className="text-gold-500 font-semibold tracking-[0.3em] uppercase text-sm mt-1">Deliveries</p>
          <p className="text-white/50 text-sm mt-4 tracking-wide italic">Fast. Reliable. Royal.</p>
        </div>
        <div className="w-48 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gold-500 rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
      <div className="absolute bottom-10 text-white/30 text-xs font-medium">Made in South Africa 🇿🇦</div>
    </div>
  );
};

// ─── Onboarding ─────────────────────────────────────────────────────────────────
const SLIDES = [
  { title: 'Order Any Food', subtitle: 'From your favourite SA restaurants — KFC, Nando\'s, Steers, and hundreds more. Delivered in minutes.', icon: '🍔', bg: '#0A0A0A', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { title: 'Live Driver Tracking', subtitle: 'Watch your order move in real-time. Know exactly when your food arrives.', icon: '📍', bg: '#1C1C1C', image: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { title: 'Fast & Secure', subtitle: 'Tap. Pay. Receive. In under 30 minutes. Secured with South African banking standards.', icon: '⚡', bg: '#0A0A0A', image: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { title: 'Earn Royalty Points', subtitle: 'Every order earns Empire Royalty Points. Redeem for free deliveries, meals, and exclusive rewards.', icon: '👑', bg: '#1C1C1C', image: 'https://images.pexels.com/photos/3943882/pexels-photo-3943882.jpeg?auto=compress&cs=tinysrgb&w=600' },
];

export const OnboardingScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [current, setCurrent] = useState(0);
  const slide = SLIDES[current];
  return (
    <div className="mobile-screen flex flex-col overflow-hidden" style={{ background: slide.bg }}>
      <StatusBar dark />
      <div className="flex-1 relative">
        <img src={slide.image} alt={slide.title} className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80" />
        <div className="relative z-10 flex flex-col justify-end h-full pb-8 px-6">
          <div className="text-7xl mb-6 animate-bounce-subtle">{slide.icon}</div>
          <h2 className="text-3xl font-black text-white leading-tight animate-slide-up">{slide.title}</h2>
          <p className="text-white/70 text-base mt-3 leading-relaxed animate-fade-in">{slide.subtitle}</p>
          <div className="flex gap-2 mt-8">
            {SLIDES.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'bg-gold-500 flex-1' : 'bg-white/20 w-6'}`} />
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            {current < SLIDES.length - 1 ? (
              <>
                <button onClick={onDone} className="flex-1 py-3.5 rounded-2xl border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-colors">Skip</button>
                <button onClick={() => setCurrent(c => c + 1)} className="flex-1 py-3.5 rounded-2xl bg-gold-500 text-empire-black font-bold text-sm hover:bg-gold-400 transition-colors">Next</button>
              </>
            ) : (
              <button onClick={onDone} className="w-full py-4 rounded-2xl bg-gold-500 text-empire-black font-bold text-base hover:bg-gold-400 transition-all shadow-gold-lg">Get Started — It's Free</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Auth Screen ─────────────────────────────────────────────────────────────────
export const AuthScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [mode, setMode] = useState<'login' | 'register' | 'otp' | 'forgot'>('login');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  if (mode === 'otp') return (
    <div className="mobile-screen flex flex-col">
      <StatusBar dark={false} />
      <div className="flex-1 px-6 py-8">
        <button onClick={() => setMode('login')} className="text-sm font-semibold text-gray-500 mb-8">← Back</button>
        <div className="mb-8">
          <div className="w-16 h-16 bg-gold-500/10 rounded-3xl flex items-center justify-center mb-5">
            <span className="text-3xl">📱</span>
          </div>
          <h2 className="text-2xl font-black text-empire-black">Enter OTP</h2>
          <p className="text-gray-500 text-sm mt-2">We sent a 6-digit code to <span className="font-semibold text-empire-black">{phone || '+27 82 000 0000'}</span></p>
        </div>
        <div className="flex gap-2 justify-between mb-8">
          {otp.map((digit, i) => (
            <input key={i} type="text" maxLength={1} value={digit} onChange={e => { const n = [...otp]; n[i] = e.target.value; setOtp(n); }} className="w-12 h-14 text-center text-xl font-bold border-2 border-surface-300 rounded-2xl focus:border-gold-500 focus:outline-none transition-colors" />
          ))}
        </div>
        <button onClick={onDone} className="btn-gold w-full">Verify & Continue</button>
        <p className="text-center text-sm text-gray-500 mt-5">Didn't receive it? <button className="text-gold-600 font-semibold">Resend in 0:45</button></p>
      </div>
    </div>
  );

  if (mode === 'forgot') return (
    <div className="mobile-screen flex flex-col">
      <StatusBar dark={false} />
      <div className="flex-1 px-6 py-8">
        <button onClick={() => setMode('login')} className="text-sm font-semibold text-gray-500 mb-8">← Back</button>
        <h2 className="text-2xl font-black text-empire-black mb-2">Forgot Password?</h2>
        <p className="text-gray-500 text-sm mb-8">Enter your email and we'll send a reset link.</p>
        <input type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} className="input-field mb-4" />
        <button onClick={() => setMode('login')} className="btn-gold w-full">Send Reset Link</button>
      </div>
    </div>
  );

  return (
    <div className="mobile-screen flex flex-col overflow-auto">
      <div className="bg-empire-black pt-12 pb-10 px-6 relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 bg-gold-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-8 w-24 h-24 bg-gold-500 rounded-full blur-2xl" />
        </div>
        <EmpireLogoWhite size={44} />
        <h2 className="text-2xl font-black text-white mt-6">{mode === 'login' ? 'Welcome back, 👑' : 'Join the Empire'}</h2>
        <p className="text-white/60 text-sm mt-1">{mode === 'login' ? 'Sign in to your account' : 'Create your free account'}</p>
      </div>

      <div className="flex-1 px-6 py-6">
        <div className="flex bg-surface-100 rounded-2xl p-1 mb-6">
          {(['login', 'register'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${mode === m ? 'bg-white text-empire-black shadow-card' : 'text-gray-500'}`}>
              {m === 'login' ? 'Login' : 'Register'}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {mode === 'register' && <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} className="input-field" />}
          <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className="input-field" />
          {mode === 'register' && <input type="tel" placeholder="Phone number (e.g. 082 000 0000)" value={phone} onChange={e => setPhone(e.target.value)} className="input-field" />}
          <div className="relative">
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="input-field pr-12" />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">SHOW</button>
          </div>
        </div>

        {mode === 'login' && <button onClick={() => setMode('forgot')} className="text-gold-600 text-sm font-semibold mt-3">Forgot password?</button>}

        <button onClick={() => mode === 'register' ? setMode('otp') : onDone()} className="btn-gold w-full mt-6">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-surface-300" />
          <span className="text-xs text-gray-400 font-medium">or continue with</span>
          <div className="flex-1 h-px bg-surface-300" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[{ icon: 'G', label: 'Google', bg: '#fff' }, { icon: '🍎', label: 'Apple', bg: '#000', textColor: '#fff' }].map(({ icon, label, bg, textColor }) => (
            <button key={label} onClick={onDone} className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-surface-300 font-semibold text-sm transition-all hover:shadow-card" style={{ background: bg, color: textColor || '#0A0A0A' }}>
              <span className="text-base">{icon}</span>{label}
            </button>
          ))}
        </div>

        {mode === 'login' && (
          <div className="mt-5 p-4 bg-surface-100 rounded-2xl flex items-center gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="text-xs font-bold text-empire-black">Biometric Login</p>
              <p className="text-xs text-gray-500">Use fingerprint or Face ID</p>
            </div>
            <button onClick={onDone} className="ml-auto text-xs font-bold text-gold-600">Enable</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Location Setup Screen ────────────────────────────────────────────────────────
export const LocationScreen: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [query, setQuery] = useState('');
  const saved = ['14 Rivonia Rd, Sandton', '22 Jan Smuts Ave, Rosebank', '1 Simmonds St, Johannesburg CBD'];
  const suggestions = ['Sandton City Mall, Sandton Dr, Johannesburg', 'Menlyn Park, Atterbury Rd, Pretoria', 'V&A Waterfront, Cape Town', 'Gateway Theatre, Umhlanga, Durban'];
  return (
    <div className="mobile-screen flex flex-col">
      <StatusBar dark={false} />
      <div className="px-5 py-4">
        <EmpireLogo size={36} />
        <h2 className="text-2xl font-black text-empire-black mt-5 mb-1">Where are you?</h2>
        <p className="text-gray-500 text-sm mb-5">Set your delivery location to see nearby restaurants.</p>
        <div className="relative mb-4">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-500" />
          <input type="text" placeholder="Search for your address..." value={query} onChange={e => setQuery(e.target.value)} className="input-field pl-11" />
        </div>
        <button onClick={onDone} className="w-full py-3.5 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-700 font-semibold text-sm flex items-center justify-center gap-2 mb-6">
          <span>📍</span> Use My Current Location
        </button>
        {saved.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Saved Addresses</p>
            {saved.map(addr => (
              <button key={addr} onClick={onDone} className="w-full flex items-center gap-3 py-3 border-b border-surface-100 last:border-0 hover:bg-surface-50 rounded-xl px-2 transition-colors">
                <div className="w-9 h-9 bg-surface-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-gold-500" />
                </div>
                <span className="text-sm font-medium text-empire-black text-left">{addr}</span>
              </button>
            ))}
          </div>
        )}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Suggestions</p>
        {suggestions.map(s => (
          <button key={s} onClick={onDone} className="w-full flex items-center gap-3 py-3 border-b border-surface-100 last:border-0 hover:bg-surface-50 rounded-xl px-2 transition-colors">
            <div className="w-9 h-9 bg-surface-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-gray-400" />
            </div>
            <span className="text-sm text-gray-600 text-left">{s}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

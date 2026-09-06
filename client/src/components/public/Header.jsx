import React, { useState } from "react";
import { MapPin, Phone, ChevronDown, Menu, X, Key } from "lucide-react";
import { Link } from "react-router-dom";
const locations = [
  {
    name: "QUICK KEY CHICAGO",
    address: ["1451 W. Irving Park Rd.,", "Chicago, IL 60613"],
  },
  {
    name: "QUICK KEY ELK GROVE VILLAGE",
    address: ["1028 W. Devon Ave.", "Elk Grove Village, IL 60007"],
  },
  {
    name: "QUICK KEY LOMBARD",
    address: ["1263 S Highland Ave Ste 1D", "Lombard, IL 60148"],
  },
];


const navItems = [
  // 🔥 Har href ke shuru mein '/' laga diya hai
  { label: "Home", href: "/#home", dropdown: false },
  { label: "Services", href: "/#services", dropdown: false },
  { label: "Why Us", href: "/#whyus", dropdown: false },
  { label: "Contact", href: "/#contact", dropdown: false },
  { label: "FAQS", href: "/#faqs", dropdown: false },
];
function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-8 h-8">
      <path
        fill="#4285F4"
        d="M24 9.5c3.4 0 6.4 1.2 8.8 3.5l6.6-6.6C35.5 2.5 30.1 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.7 6C12.1 13 17.6 9.5 24 9.5z"
      />
      <path
        fill="#34A853"
        d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7C43.9 37.5 46.5 31.5 46.5 24.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.3 19.2c-.5 1.5-.8 3.1-.8 4.8s.3 3.3.8 4.8l-7.7 6C.9 31.4 0 27.8 0 24s.9-7.4 2.6-10.8l7.7 6z"
      />
      <path
        fill="#EA4335"
        d="M24 48c6.1 0 11.5-2 15.3-5.5l-7.3-5.7c-2 1.4-4.6 2.2-8 2.2-6.4 0-11.9-3.5-13.7-8.8l-7.7 6C6.5 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        fill="#fff"
        d="M15.5 12.5h-2.2V20h-3v-7.5H9v-2.6h1.3V8.4c0-1.9 1-3 3.4-3h2.1v2.6h-1.3c-.8 0-1 .4-1 1v1.4h2.3l-.3 2.6z"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <defs>
        <linearGradient id="igGrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#FEDA75" />
          <stop offset="30%" stopColor="#FA7E1E" />
          <stop offset="60%" stopColor="#D62976" />
          <stop offset="100%" stopColor="#962FBF" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="12" fill="url(#igGrad)" />
      <rect x="7" y="7" width="10" height="10" rx="3" fill="none" stroke="#fff" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="2.6" fill="none" stroke="#fff" strokeWidth="1.4" />
      <circle cx="15.2" cy="8.8" r="0.6" fill="#fff" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <circle cx="12" cy="12" r="12" fill="#FF0000" />
      <path fill="#fff" d="M10 8.5l6 3.5-6 3.5z" />
    </svg>
  );
}

function YelpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8">
      <circle cx="12" cy="12" r="12" fill="#D32323" />
      <text
        x="12"
        y="15"
        textAnchor="middle"
        fontSize="6.5"
        fontStyle="italic"
        fontWeight="bold"
        fill="#fff"
        fontFamily="Georgia, serif"
      >
        yelp
      </text>
    </svg>
  );
}

export default function QuickKeyHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full font-sans">
      {/* Top location bar */}
      <div className="hidden md:flex bg-gray-100 justify-center gap-14 px-6 py-3 border-b border-gray-200">
        {locations.map((loc) => (
          <div key={loc.name} className="flex items-start gap-2">
            <span className="bg-red-600 rounded p-1.5 mt-0.5 flex-shrink-0">
              <MapPin className="w-4 h-4 text-white" fill="white" />
            </span>
            <div>
              <p className="font-bold text-sm text-gray-800 tracking-wide">{loc.name}</p>
              {loc.address.map((line, i) => (
                <p key={i} className="text-sm text-gray-600 leading-tight">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Middle logo / CTA bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 px-6 py-4 bg-white border-b border-gray-100">
        {/* Logo — swap this block for your real logo image */}
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center flex-shrink-0">
            <Key className="w-8 h-8 text-white" />
          </div>
          <div className="leading-none">
            <p className="text-3xl font-extrabold">
              <span className="text-red-600">Quick</span> <span className="text-black">Key</span>
            </p>
            <p className="text-xl text-gray-400 font-light -mt-1">Locksmith</p>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-4 flex-wrap">
<Link
  to="/login"
  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-6 py-3 rounded-md transition-colors"
>
  Vendor Login
</Link>
<a href="#contact" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold uppercase tracking-wide px-8 py-3 rounded-md transition-colors inline-block text-center">
  Book Online
</a>
        </div>

        {/* Social icons */}
        <div className="hidden lg:flex items-center gap-3">
          <a href="#" aria-label="Google">
            <GoogleIcon />
          </a>
          <a href="#" aria-label="Facebook">
            <FacebookIcon />
          </a>
          <a href="#" aria-label="Instagram">
            <InstagramIcon />
          </a>
          <a href="#" aria-label="YouTube">
            <YoutubeIcon />
          </a>
          <a href="#" aria-label="Yelp">
            <YelpIcon />
          </a>
          <a href="#" aria-label="Angi" className="text-orange-500 font-bold text-xl italic ml-1">
            Angi
          </a>
        </div>
      </div>

      {/* Bottom nav bar */}
      <nav className="bg-black text-white">
        <div className="hidden md:flex justify-center gap-10 py-4">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-1 font-semibold text-sm tracking-wide hover:text-yellow-500 transition-colors"
            >
              {item.label}
              {item.dropdown && <ChevronDown className="w-4 h-4" />}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex justify-between items-center px-6 py-4">
          <span className="font-semibold">Menu</span>
          <button onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
  {mobileOpen && (
  <div className="md:hidden flex flex-col px-6 pb-4 gap-3">
    {navItems.map((item) => (
      <a 
        key={item.label} 
        href={item.href} 
        onClick={() => setMobileOpen(false)} 
        // 👇 Thori si mobile styling bhi add kar di hai taake pyara lagay
        className="text-white font-semibold tracking-wide py-2 border-b border-gray-800 hover:text-yellow-500 transition-colors"
      >
        {item.label} {/* ✅ Yahan label aayega tabhi text show hoga! */}
      </a>
    ))}
  </div>
)}
      </nav>
    </header>
  );
}

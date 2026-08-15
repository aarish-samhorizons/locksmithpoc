import React from "react";
import { Mail, MessageCircle, Star, ChevronUp, Key } from "lucide-react";

const shopLocations = [
  {
    name: "QUICK KEY CHICAGO",
    address: ["1451 W. Irving Park Rd.", "Chicago, IL 60613"],
    phone: "773-999-9354",
  },
  {
    name: "QUICK KEY ELK GROVE VILLAGE",
    address: ["1028 W. Devon Ave.", "Elk Grove Village, IL 60007"],
    phone: "224-993-5577",
  },
  {
    name: "QUICK KEY LOMBARD",
    address: ["1263 S Highland Ave Ste 1D", "Lombard, IL 60148"],
    phone: "630-517-4315",
  },
];

function SectionHeading({ children }) {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-bold text-white mb-3">{children}</h3>
      <div className="border-b border-gray-700 w-full" />
    </div>
  );
}

/* Multi-color Google "G" — used in the review badge */
function GoogleGIcon({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <path fill="#4285F4" d="M24 9.5c3.4 0 6.4 1.2 8.8 3.5l6.6-6.6C35.5 2.5 30.1 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.7 6C12.1 13 17.6 9.5 24 9.5z" />
      <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7C43.9 37.5 46.5 31.5 46.5 24.5z" />
      <path fill="#FBBC05" d="M10.3 19.2c-.5 1.5-.8 3.1-.8 4.8s.3 3.3.8 4.8l-7.7 6C.9 31.4 0 27.8 0 24s.9-7.4 2.6-10.8l7.7 6z" />
      <path fill="#EA4335" d="M24 48c6.1 0 11.5-2 15.3-5.5l-7.3-5.7c-2 1.4-4.6 2.2-8 2.2-6.4 0-11.9-3.5-13.7-8.8l-7.7 6C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

/* Blue square Google Business badge — used in the follow/review row */
function GoogleBusinessIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-9 h-9">
      <rect width="24" height="24" rx="6" fill="#4285F4" />
      <text x="12" y="17" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#fff" fontFamily="Arial, sans-serif">
        G
      </text>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-9 h-9">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path fill="#fff" d="M15.5 12.5h-2.2V20h-3v-7.5H9v-2.6h1.3V8.4c0-1.9 1-3 3.4-3h2.1v2.6h-1.3c-.8 0-1 .4-1 1v1.4h2.3l-.3 2.6z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-9 h-9">
      <defs>
        <linearGradient id="igGrad2" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#FEDA75" />
          <stop offset="30%" stopColor="#FA7E1E" />
          <stop offset="60%" stopColor="#D62976" />
          <stop offset="100%" stopColor="#962FBF" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="12" fill="url(#igGrad2)" />
      <rect x="7" y="7" width="10" height="10" rx="3" fill="none" stroke="#fff" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="2.6" fill="none" stroke="#fff" strokeWidth="1.4" />
      <circle cx="15.2" cy="8.8" r="0.6" fill="#fff" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-9 h-9">
      <circle cx="12" cy="12" r="12" fill="#FF0000" />
      <path fill="#fff" d="M10 8.5l6 3.5-6 3.5z" />
    </svg>
  );
}

function YelpIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-9 h-9">
      <circle cx="12" cy="12" r="12" fill="#D32323" />
      <text x="12" y="15" textAnchor="middle" fontSize="6.5" fontStyle="italic" fontWeight="bold" fill="#fff" fontFamily="Georgia, serif">
        yelp
      </text>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 md:px-16 py-12 relative">
      <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
        {/* About Us */}
        <div>
          <SectionHeading>About Us</SectionHeading>

          {/* Logo — swap for your real logo image */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center flex-shrink-0">
              <Key className="w-7 h-7 text-white" />
            </div>
            <div className="leading-none">
              <p className="text-2xl font-extrabold">
                <span className="text-red-600">Quick</span> <span className="text-white">Key</span>
              </p>
              <p className="text-lg text-gray-400 font-light -mt-1">Locksmith</p>
            </div>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Our professional locksmiths provide the best residential, commercial, and automotive
            locksmith services throughout the Chicagoland area. Whether dealing with a lockout,
            lock replacement, lock rekeying, access control system setup, or custom hardware
            installation, our experienced team of licensed, bonded, and fully-insured locksmiths
            will help you with all your security needs.
          </p>
          <p className="text-gray-400 text-sm mb-6">IL Locksmith Agency #192.000306</p>


        </div>

        {/* Our Shop Locations */}
        <div>
          <SectionHeading>Our Shop Locations</SectionHeading>
          <div className="space-y-8">
            {shopLocations.map((loc) => (
              <div key={loc.name}>
                <p className="font-bold text-sm tracking-wide mb-1">{loc.name}</p>
                {loc.address.map((line, i) => (
                  <p key={i} className="text-gray-300 text-sm leading-snug">
                    {line}
                  </p>
                ))}
                <a
                  href={`tel:${loc.phone}`}
                  className="inline-block mt-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-5 py-2.5 rounded transition-colors"
                >
                  {loc.phone}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Us & Book a Service */}
        <div>
          <SectionHeading>Contact Us &amp; Book a Service</SectionHeading>

          <div className="flex flex-col gap-3 mb-6">
<a
  href="#contact"
  className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-6 py-3 rounded text-center transition-colors"
>
  Book Online
</a>

          </div>

          <a href="#" className="flex items-center gap-2 text-white font-semibold text-sm mb-8 hover:text-gray-300">
            <Mail className="w-5 h-5" />
            Email Us
          </a>

          <h4 className="text-lg font-bold text-white mb-3">Follow &amp; Review Us</h4>
          <div className="border-b border-gray-700 w-full mb-4" />
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <a href="#" aria-label="Google Business"><GoogleBusinessIcon /></a>
            <a href="#" aria-label="Facebook"><FacebookIcon /></a>
            <a href="#" aria-label="Instagram"><InstagramIcon /></a>
            <a href="#" aria-label="YouTube"><YoutubeIcon /></a>
            <a href="#" aria-label="Yelp"><YelpIcon /></a>
            <a href="#" className="text-orange-500 font-bold text-xl italic ml-1">Angi</a>
          </div>

          <h4 className="text-lg font-bold text-white mb-3">Federal Clients Shop Here</h4>
          <div className="border-b border-gray-700 w-full mb-4" />
          <div className="flex items-stretch rounded overflow-hidden w-56 h-16 shadow">
            <div className="bg-blue-900 text-white flex items-center justify-center px-3 font-extrabold text-lg tracking-wide">
              GSA
            </div>
            <div className="bg-white flex items-center justify-center px-3 flex-1">
              <span className="text-red-700 font-extrabold italic text-lg">Advantage!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto border-t border-gray-800 mt-10 pt-6 text-center">
        <p className="text-gray-400 text-sm">
          Copyright © Quick Key Locksmith &amp; Security | Powered by{" "}
          <a href="#" className="text-red-500 hover:text-red-400">
            The Locksmith Agency
          </a>{" "}
          | Verified by 1-800 Unlocks | Verified Real Locksmiths
        </p>
      </div>

      {/* Floating chat bubble */}


      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 items-center justify-center transition-colors"
      >
        <ChevronUp className="w-5 h-5 text-white" />
      </button>

      {/* Google review badge */}
      {/* <div className="fixed md:absolute bottom-6 right-6 bg-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-2">
        <GoogleGIcon className="w-8 h-8 flex-shrink-0" />
        <div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-800">4.9</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 text-orange-400" fill="currentColor" />
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500">Based on 6477 reviews</p>
        </div>
      </div> */}
    </footer>
  );
}

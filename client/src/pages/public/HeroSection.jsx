import React from "react";
import { MessageCircle, Star } from "lucide-react";
import heroVideo from "../../assets/heroVideo.mp4"; // Adjust the path as needed
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

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden flex items-center">
      {/* Background video — adjust the src path to match your bundler
          (e.g. a Vite/CRA "public" path like "/assets/heroVideo.mp4",
          or `import heroVideo from "./assets/heroVideo.mp4"` if it's bundled) */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={heroVideo}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Dark overlay so text stays readable over the video */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl px-6 md:px-16">
        <div className="flex items-stretch gap-5 mb-6">
          <div className="w-1.5 bg-red-600 flex-shrink-0" />
          <h1 className="text-4xl md:text-6xl font-extrabold text-white uppercase leading-tight drop-shadow-lg">
            Your full-service local locksmith in{" "}
            <span className="text-red-600">Chicago, IL</span>
          </h1>
        </div>

        <p className="text-white text-lg md:text-xl mb-8 max-w-2xl drop-shadow">
          Reliable locksmith services for homes, vehicles, and businesses across the Chicago metro area.
        </p>

        <a
          href="#services"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold text-sm uppercase tracking-wide px-8 py-4 rounded transition-colors"
        >
          Learn About Our Services
        </a>
      </div>

      {/* Floating chat bubble */}


      {/* Google review badge */}
      <div className="absolute bottom-6 right-6 bg-white rounded-lg shadow-lg px-4 py-3 flex items-center gap-2 z-10">
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
      </div>
    </section>
  );
}

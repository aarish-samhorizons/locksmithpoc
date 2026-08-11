import React from "react";
import { Star, Pencil } from "lucide-react";

const reviews = [
  {
    name: "Cary Ryan",
    time: "10 months ago",
    initial: "C",
    color: "bg-purple-600",
    rating: 5,
    text: "Joe and Brenden provided me with a quick and effortless experience while servicing my keys! Recommend! Super cool guys and I'll always come here for the service!",
  },
  {
    name: "Johnny Palumbo",
    time: "10 months ago",
    initial: "J",
    color: "bg-indigo-500",
    rating: 5,
    text: "Quick fast service, Brendon was super helpful!",
  },
  {
    name: "Kerri Stumpo Gouveia",
    time: "10 months ago",
    initial: "K",
    color: "bg-rose-400",
    rating: 5,
    text: "After multiple failed attempts to cut house keys at Home Depot a neighbor recommended QuickKey. Dominic was super helpful and efficient. Great service!",
  },
  {
    name: "Dean Brown",
    time: "10 months ago",
    initial: "D",
    color: "bg-indigo-400",
    rating: 5,
    text: "Came here and got great service. Dominic was attentive and helpful.",
  },
  {
    name: "Greg Goldstein",
    time: "10 months ago",
    initial: "G",
    color: "bg-purple-700",
    rating: 5,
    text: "Just had Dominic make a few copies of keys and the experience was fantastic! Have had an amazing experience each time!",
  },
  {
    name: "Heather Eisele",
    time: "10 months ago",
    initial: "H",
    color: "bg-slate-500",
    rating: 5,
    text: "This place is fantastic and Dominic was very helpful!",
  },
];

/* Multi-color Google "G" */
function GoogleGIcon({ className = "w-7 h-7" }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <path fill="#4285F4" d="M24 9.5c3.4 0 6.4 1.2 8.8 3.5l6.6-6.6C35.5 2.5 30.1 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.7 6C12.1 13 17.6 9.5 24 9.5z" />
      <path fill="#34A853" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7C43.9 37.5 46.5 31.5 46.5 24.5z" />
      <path fill="#FBBC05" d="M10.3 19.2c-.5 1.5-.8 3.1-.8 4.8s.3 3.3.8 4.8l-7.7 6C.9 31.4 0 27.8 0 24s.9-7.4 2.6-10.8l7.7 6z" />
      <path fill="#EA4335" d="M24 48c6.1 0 11.5-2 15.3-5.5l-7.3-5.7c-2 1.4-4.6 2.2-8 2.2-6.4 0-11.9-3.5-13.7-8.8l-7.7 6C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

/* Star row that supports a fractional rating (e.g. 4.9) for the summary line */
function StarRow({ rating = 5, size = "w-5 h-5" }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => {
        const fillAmount = Math.max(0, Math.min(1, rating - i));
        return (
          <div key={i} className={`relative ${size}`}>
            <Star className={`${size} text-gray-300 absolute inset-0`} fill="currentColor" />
            {fillAmount > 0 && (
              <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillAmount * 100}%` }}>
                <Star className={`${size} text-orange-400`} fill="currentColor" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ReviewCard({ name, time, initial, color, rating, text }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full ${color} flex items-center justify-center text-white font-bold flex-shrink-0`}>
            {initial}
          </div>
          <div>
            <p className="font-bold text-gray-800 text-sm">{name}</p>
            <p className="text-gray-500 text-xs">{time}</p>
          </div>
        </div>
        <GoogleGIcon className="w-6 h-6 flex-shrink-0" />
      </div>
      <StarRow rating={rating} size="w-4 h-4" />
      <p className="text-gray-600 text-sm leading-relaxed mt-3">{text}</p>
    </div>
  );
}

export default function Review() {
  return (
    <section className="bg-gray-50 px-6 md:px-16 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
              Check Out Our Google Reviews
            </h2>
            <div className="w-24 h-1 bg-red-600 mb-6" />

            <p className="font-bold text-gray-800 text-lg">Quick Keys Locksmith</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-bold text-gray-800">4.9</span>
              <StarRow rating={4.9} size="w-5 h-5" />
              <span className="text-gray-500 text-sm">Over 3923 Reviews</span>
            </div>
          </div>


        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {reviews.map((review) => (
            <ReviewCard key={review.name} {...review} />
          ))}
        </div>


      </div>
    </section>
  );
}

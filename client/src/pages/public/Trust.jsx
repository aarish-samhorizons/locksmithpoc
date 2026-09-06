import React from "react";
import { Phone } from "lucide-react";

const cities = [
  "Addison", "Algonquin", "Arlington Heights", "Barrington", "Bartlett", "Batavia",
  "Bellwood", "Bensenville", "Berkeley", "Bolingbrook", "Buffalo Grove", "Carol Stream",
  "Chicago", "Cicero", "Downers Grove", "Elgin", "Elk Grove Village", "Elmhurst",
  "Franklin Park", "Glen Ellyn", "Glencoe", "Hanover Park", "Highland Park", "Hillside",
  "Hinsdale", "Hoffman Estates", "Itasca", "Joliet", "Lake Zurich", "Lakeview",
  "Lincolnshire", "Lisle", "Lombard", "Mount Prospect", "Naperville", "Northbrook",
  "Oak Brook", "Oak Park", "Orland Park", "Palatine", "Park Ridge", "Plainfield",
  "Romeoville", "Roselle", "Schaumburg", "Schiller Park", "St. Charles", "Streamwood",
  "Villa Park", "Warrenville", "West Chicago", "Wheaton", "Willowbrook", "Winnetka",
  "Wood Dale", "Woodridge",
];

/* Subtle repeating triangle texture, same pattern used on the Why Us section */
function PatternBackground() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='52' viewBox='0 0 60 52'><path d='M30 0 L60 52 L0 52 Z' fill='none' stroke='#000000' stroke-opacity='0.06'/></svg>`;
  const pattern = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{ backgroundImage: `url("${pattern}")`, backgroundSize: "60px 52px" }}
    />
  );
}

export default function Trust() {
  return (
    <section className="relative bg-gray-50 py-20 px-6 md:px-16 overflow-hidden">
      <PatternBackground />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800 leading-snug mb-4">
          Quick Key Locksmith is the trusted choice for reliable, affordable locksmith services in
          and around Chicago, IL
        </h2>
        <div className="w-24 h-1 bg-red-600 mx-auto mb-8" />

        <p className="font-bold text-gray-800 mb-6">
          Here are a few of the locations we service in the Chicago metro area:
        </p>

        <p className="text-sm leading-loose mb-10">
          {cities.map((city, i) => (
            <React.Fragment key={city}>
              <span className="text-red-600 font-bold">
                {city}, IL
              </span>
              {i < cities.length - 1 && <span className="text-gray-500"> | </span>}
            </React.Fragment>
          ))}
        </p>
      </div>
    </section>
  );
}
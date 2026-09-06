import React from "react";
import { Check, ExternalLink } from "lucide-react";
import whyus from "../../assets/whyus.jpg"; // Adjust the path as needed
const whyUsPoints = [
  {
    title: "Trusted Professional Locksmiths",
    description:
      "Our technicians are highly trained, licensed, bonded, and insured. When you call us for service, you can rest assured you're getting the best locksmiths in Chicago!",
  },
  {
    title: "Mobile & Walk-In Convenience",
    description: (
      <>
        Call us for convenient mobile service, or visit one of our walk-in storefront locations
        in{" "}
        <a href="#" className="text-red-600 font-bold hover:underline inline-flex items-center gap-0.5">
          Chicago <ExternalLink className="w-3 h-3" />
        </a>
        ,{" "}
        <a href="#" className="text-red-600 font-bold hover:underline inline-flex items-center gap-0.5">
          Elk Grove Village <ExternalLink className="w-3 h-3" />
        </a>
        , and Lombard, IL.
      </>
    ),
  },
  {
    title: "Transparent Pricing & Warranty",
    description:
      "We offer transparent pricing with a 6-month labor warranty, and a 1-year warranty on parts (where applicable) in addition to all manufacturer warranties.",
  },
  {
    title: "Service Across the Chicago Area",
    description:
      "From the Loop and Lincoln Park to Schaumburg and Oak Brook, we cover the entire Chicago area with reliable services you can count on.",
  },
  {
    title: "Real Solutions for Everyday Problems",
    description:
      "We help with everything from car lockouts to access control upgrades—our locksmiths are trained to handle a wide range of locksmith jobs.",
  },
];

/* Subtle repeating triangle texture, matching the light background pattern */
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

export default function Whyus() {
  return (
    <section id="whyus" className="relative bg-gray-50 py-16 px-6 md:px-16 overflow-hidden">
      <PatternBackground />

      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
          Why Choose Quick Key Locksmith?
        </h2>
        <div className="w-24 h-1 bg-red-600 mb-10" />

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Checklist */}
          <div className="space-y-8">
            {whyUsPoints.map((point) => (
              <div key={point.title} className="flex gap-4">
                <Check className="w-7 h-7 text-red-600 flex-shrink-0 mt-1" strokeWidth={3.5} />
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{point.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{point.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Image + caption */}
          <div className="border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
            <img src={whyus} alt="Quick Key Locksmith team" className="w-full h-80 object-cover" />
            <p className="p-5 text-gray-600 text-sm leading-relaxed">
              Quick Key Locksmith provides Chicago and the surrounding region with the best, most
              professional locksmith services available.
            </p>
          </div>
        </div>

        {/* Trust block */}
        <div className="mt-20 max-w-4xl">
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-4">
            Trusted Locksmiths for Your Home, Car, or Business
          </h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            Whether you've had a break-in, misplaced a key, or need to install new locks at your
            office, we're ready to help. Our locksmith technicians use professional tools and
            methods to ensure safe entry, proper installation, and long-term performance. From
            handling emergency lockout services to setting up master key systems for commercial
            clients, we approach every job with clear communication and dependable service.
          </p>
          <p className="text-gray-600 leading-relaxed">
            <a href="#" className="text-red-600 font-bold hover:underline">
              Contact us today
            </a>{" "}
            or stop by one of our storefront locations for walk-in service. We're the locksmith in
            Chicago who's ready for all your locksmith needs—from key duplication to CCTV
            integration.
          </p>
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { Key } from "lucide-react";

/*
  Asset mapping — based on the filenames in your assets folder.
  A few are confident matches; a couple had no obvious filename match,
  so those are flagged as TODO with a placeholder background instead
  of guessing wrong. Swap paths/import style to match your bundler
  (Vite/CRA public path shown below, or `import x from "./assets/x.jpg"`
  if these are bundled assets).
*/
import carKeyImg from "../../assets/ServicesCarKey.jpg";
import residentialImg from "../../assets/resedentialServices.jpg";
import accessControlImg from "../../assets/AcessControlLockServices.jpg";
import masterKeyImg from "../../assets/masterKeyServices.jpg";
import lockServicesImg from "../../assets/LockServices.jpg";
import safeVaultImg from "../../assets/safeVaultServices.jpg";
const services = [
  {
    title: "Automotive",
    image: carKeyImg,
    description:
      "We unlock vehicles, cut and program car keys, and program fobs, remotes, and chip keys for drivers across Chicago. Call for mobile service or stop by one of our storefronts.",
  },
  {
    title: "Residential",
    image: residentialImg,
    description:
      "We install, repair, and rekey locks on homes, apartments, and condos to improve security and restore access after move-ins or lockouts. We also install smart locks and decorative door hardware.",
  },
  {
    title: "Master Key Systems",
    image: masterKeyImg,
    description:
      "We help business owners and property managers secure their buildings with commercial-grade locks, master key systems, and access control. Available for scheduled installs or emergency lockouts.",
  },
  {
    title: "Access Control",
    image: accessControlImg, // reused — same asset as Access Control, swap if you have a dedicated one
    description:
      "From keypad entry to full electronic access systems, we design and install access control solutions for offices, apartment buildings, and commercial properties.",
  },
  {
    title: "Safe Locksmith",
    image: safeVaultImg, // reused — same asset as Safe & Vault, swap if you have a dedicated one
    description:
      "We sell, install, repair and open safes for commercial and residential clients across the Chicago region. We also offer safe lock upgrades and combination changes.",
  },
  {
    title: "Lockout Service",
    image: lockServicesImg, // TODO: no matching asset found for this one — add e.g. "/assets/lockoutServices.jpg"
    description:
      "Locked out of your home, car, or business? Our mobile locksmiths respond quickly across the Chicago metro area to get you back in safely.",
  },
];

function ServiceCard({ title, image, description }) {
  return (
    <div id="services" className="group relative h-72 overflow-hidden cursor-pointer">
      {image ? (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
          <Key className="w-16 h-16 text-gray-500" />
        </div>
      )}

      {/* Overlay — darkens further on hover */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/75 transition-colors duration-300" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h3 className="text-2xl font-bold text-white uppercase tracking-wide transition-transform duration-300 group-hover:-translate-y-2">
          {title}
        </h3>

        <div className="max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 overflow-hidden transition-all duration-300 mt-3">
          <p className="text-white text-sm leading-relaxed mb-4">{description}</p>

        </div>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  return (
    <section className="bg-white px-6 md:px-16 py-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
          Providing Locksmith Services in the Chicago, IL Region
        </h2>
        <div className="w-24 h-1 bg-red-600 mb-8" />

        <div className="space-y-5 text-gray-600 text-base leading-relaxed max-w-4xl mb-12">
          <p>
            At Quick Key Locksmith &amp; Security, we provide professional locksmith services
            across Chicago and the surrounding suburbs. Whether you're locked out, need locks
            changed, want to upgrade to high-security deadbolts or require a full access control
            system, our mobile locksmith team is ready to help.
          </p>
          <p>
            We serve homeowners, renters, drivers, business owners, and property managers with a
            wide range of locksmith services, available on-site or at one of our two walk-in
            storefronts in Wheaton and Elk Grove Village, IL. Since 2013, we've helped thousands
            of customers improve their property's security with innovative, reliable solutions
            and highly trained locksmith technicians who do the job right.
          </p>
          <p>
            Our team offers reliable services during regular business hours, including same-day
            service for many jobs. When you search for a "locksmith near me" in the Chicago area,
            we deliver trusted, local support backed by real experience and dependable tools.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}

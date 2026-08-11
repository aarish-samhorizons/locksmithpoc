import React from 'react';
import HowItWorks from './HowItWorks';
import Services from './Services';
import Contact from './Contact';
import HeroSection from './HeroSection';
import Review from './Review';
import Whyus from './Whyus';
import Faqs from './Faqs'
import Trust from './Trust';
export default function Home() {
  return (
    <div className="flex flex-col bg-slate-50">

      <HeroSection/>

      {/* 3. <HowItWorks /> */}
     

      {/* 4. SERVICES SECTION */}
      <Services />
      <Whyus />
      <Review />
      <Faqs />
      <Trust />

      {/* 5. WHY US / TRUST & 6. BOOK NOW (Embedded inside Contact component) */}
      <Contact />
    </div>
  );
}
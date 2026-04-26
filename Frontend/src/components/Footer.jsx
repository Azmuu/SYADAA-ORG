import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';
import logoMark from '../assets/logo.jpeg';

const Footer = () => {
  return (
    <footer className="border-t border-brand/10 bg-brand-muted pb-10 pt-16 transition-colors duration-200 dark:border-white/10 dark:bg-[#0a100e]">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mb-14 grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="space-y-5 md:col-span-5">
            <div className="flex items-start gap-4">
              <img
                src={logoMark}
                alt=""
                className="h-16 w-16 shrink-0 rounded-full object-cover shadow-md ring-2 ring-brand/20"
                width={64}
                height={64}
              />
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-semibold tracking-tight text-brand">SYADA ORG</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Awareness & development
                </span>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-neutral-600">
              Waxaan nahay urur u taagan xoojinta iyo horumarinta dhallinyarada Soomaaliyeed.
            </p>
          </div>

          <div className="md:col-span-3">
            <h4 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">Navigation</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="text-neutral-600 transition-colors hover:text-brand">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-600 transition-colors hover:text-brand">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-600 transition-colors hover:text-brand">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">Contact us</h4>
            <div className="space-y-3 text-sm text-neutral-600">
              <p className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-brand" />
                syadaorg2012@gmail.com
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-brand" />
                +252 61 4524693
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-brand/10 pt-8 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            © 2026 SYADA Organization. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

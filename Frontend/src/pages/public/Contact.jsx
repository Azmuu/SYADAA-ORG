import React from 'react';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-brand-muted">
      <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">Connect with us</p>
            <h1 className="mb-6 text-4xl font-semibold leading-tight tracking-tight text-neutral-900 lg:text-5xl">
              La xiriir <span className="text-brand">SYADA</span>.
            </h1>
            <p className="mb-10 max-w-md text-lg leading-relaxed text-neutral-500">
              Su&apos;aalo ku saabsan howlaheena, xubinnimada, ama iskaashiga? Kooxdeenu waxay diyaar u tahay inay kaa caawiso.
            </p>

            <div className="space-y-8">
              <ContactLink icon={<Mail size={20} />} label="Email" value="syadaorg2012@gmail.com" />
              <ContactLink icon={<Phone size={20} />} label="Phone" value="+252 61 4524693" />
              <ContactLink icon={<MapPin size={20} />} label="Regions" value="Mogdishu Benadir Somalia " />
            </div>
          </div>

          <div className="rounded-[2rem] border border-brand/10 bg-white p-8 shadow-sm md:p-12">
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormGroup label="Full name" placeholder="Magacaaga" />
                <FormGroup label="Email" placeholder="you@example.com" type="email" />
              </div>
              <div>
                <label className="mb-3 block text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Subject</label>
                <select className="w-full rounded-xl border-0 bg-brand-soft/40 p-4 text-sm outline-none ring-1 ring-brand/15 focus:ring-2 focus:ring-brand/25">
                  <option>General inquiry</option>
                  <option>Partnership</option>
                  <option>Membership</option>
                </select>
              </div>
              <div>
                <label className="mb-3 block text-[10px] font-semibold uppercase tracking-widest text-neutral-400">Message</label>
                <textarea
                  rows={5}
                  placeholder="Sidee baan kuu caawin karnaa?"
                  className="w-full resize-none rounded-xl border-0 bg-brand-soft/40 p-4 text-sm outline-none ring-1 ring-brand/15 focus:ring-2 focus:ring-brand/25"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-brand py-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-dark"
              >
                Send message
              </button>
            </form>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="relative flex min-h-[420px] items-end overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand to-logo-navy-dark p-8 lg:col-span-2">
            <div className="absolute inset-0 opacity-30">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="relative z-10 max-w-sm rounded-2xl bg-white p-6 shadow-xl">
              <h4 className="mb-2 text-left text-lg font-semibold text-brand">Ururka dhallinyarada</h4>
              <p className="text-left text-xs leading-relaxed text-neutral-500">
                SYADA waa urur aan dawli ahayn oo u taagan horumarinta dhallinyarada Soomaaliyeed.
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between rounded-[2rem] bg-logo-navy p-10 text-white">
            <div>
              <h3 className="mb-3 text-2xl font-semibold tracking-tight">Stay in touch</h3>
              <p className="text-sm leading-relaxed text-white/55">Hel wararka howlaha iyo dhacdooyinka dhallinyarada.</p>
            </div>
            <div className="mt-10 space-y-3">
              <SocialItem label="Email" />
              <SocialItem label="Community" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactLink = ({ icon, label, value }) => (
  <div className="group flex cursor-pointer items-center gap-5">
    <div className="rounded-2xl bg-white p-4 text-brand shadow-sm ring-1 ring-brand/15 transition-all group-hover:bg-brand group-hover:text-white">
      {icon}
    </div>
    <div>
      <p className="mb-1 text-[9px] font-semibold uppercase tracking-widest text-neutral-400">{label}</p>
      <p className="font-medium text-neutral-900">{value}</p>
    </div>
  </div>
);

const FormGroup = ({ label, placeholder, type = 'text' }) => (
  <div>
    <label className="mb-3 block text-[10px] font-semibold uppercase tracking-widest text-neutral-400">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full rounded-xl border-0 bg-brand-soft/40 p-4 text-sm outline-none ring-1 ring-brand/15 focus:ring-2 focus:ring-brand/25"
    />
  </div>
);

const SocialItem = ({ label }) => (
  <div className="group flex cursor-pointer items-center justify-between rounded-2xl bg-white/5 p-4 transition-colors hover:bg-white/10">
    <span className="text-sm font-medium tracking-wide">{label}</span>
    <ArrowUpRight size={18} className="text-white/35 transition-colors group-hover:text-white" />
  </div>
);

export default Contact;

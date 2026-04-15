import React from 'react';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* Left Side */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-6">Connect With Us</p>
            <h1 className="text-6xl font-black leading-tight text-gray-900 mb-8">
              Let’s build the <span className="text-[#065F46] italic underline">archive</span> together.
            </h1>
            <p className="text-gray-500 text-lg mb-12 max-w-md">
              Have inquiries regarding our initiatives or want to contribute to our digital journal? Our team is here to support the transition.
            </p>
            
            <div className="space-y-10">
              <ContactLink icon={<Mail size={20}/>} label="Email" value="connect@syada.org" />
              <ContactLink icon={<Phone size={20}/>} label="Phone" value="+1 (555) 012-3456" />
              <ContactLink icon={<MapPin size={20}/>} label="Address" value="482 Digital Plaza, Suite 200, San Francisco, CA 94103" />
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="bg-[#F9FAFB] p-12 rounded-[40px] border border-gray-100">
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormGroup label="Full Name" placeholder="John Doe" />
                <FormGroup label="Email Address" placeholder="john@example.com" type="email" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 mb-3 block tracking-widest">Subject</label>
                <select className="w-full bg-white border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#065F46] outline-none">
                  <option>General Inquiry</option>
                  <option>Partnership</option>
                  <option>Archive Contribution</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 mb-3 block tracking-widest">Message</label>
                <textarea rows="5" placeholder="How can we help you?" className="w-full bg-white border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#065F46] outline-none"></textarea>
              </div>
              <button className="w-full bg-[#065F46] text-white font-bold py-4 rounded-xl hover:bg-[#043d2d] transition-all shadow-lg shadow-green-900/10">
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section: Map & Socials */}
        <div className="mt-32 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 relative rounded-[40px] overflow-hidden h-[500px] bg-[#1A1A1A]">
             {/* Map Placeholder */}
             <div className="absolute inset-0 opacity-20 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-122.4194,37.7749,12,0/800x500?access_token=YOUR_TOKEN')] bg-cover"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white/10 text-[150px] font-black rotate-12 tracking-tighter">NETWORK</span>
             </div>
             <div className="absolute bottom-10 left-10 bg-white p-8 rounded-3xl shadow-2xl max-w-sm">
                <h4 className="font-bold text-lg mb-2 text-gray-900 text-left">Main Headquarters</h4>
                <p className="text-xs text-gray-400 leading-relaxed text-left">Visit our archival center for in-person consultations and workshops. We're open Monday-Friday.</p>
             </div>
          </div>
          <div className="bg-[#2A2A2A] rounded-[40px] p-12 text-white flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-black mb-4">Join Our Network</h3>
              <p className="text-sm text-white/50 leading-relaxed">Stay updated with our latest archival releases and community milestones.</p>
            </div>
            <div className="space-y-4">
              <SocialItem label="Instagram" />
              <SocialItem label="LinkedIn" />
              <SocialItem label="Twitter" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactLink = ({ icon, label, value }) => (
  <div className="flex items-center gap-6 group cursor-pointer">
    <div className="bg-gray-50 p-4 rounded-2xl text-[#065F46] group-hover:bg-[#065F46] group-hover:text-white transition-all">{icon}</div>
    <div>
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const FormGroup = ({ label, placeholder, type = "text" }) => (
  <div>
    <label className="text-[10px] font-bold uppercase text-gray-400 mb-3 block tracking-widest">{label}</label>
    <input type={type} placeholder={placeholder} className="w-full bg-white border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#065F46] outline-none" />
  </div>
);

const SocialItem = ({ label }) => (
  <div className="flex justify-between items-center bg-white/5 p-5 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer group">
    <span className="font-bold text-sm tracking-wide">{label}</span>
    <ArrowUpRight size={18} className="text-white/30 group-hover:text-white transition-colors" />
  </div>
);

export default Contact;
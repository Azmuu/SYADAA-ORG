import React from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react'; // 🔥 Waxaan ku daray ExternalLink halkan
import Footer from '../../components/Footer';
import About from './About';

// 🔥 Waxaan halkan ku daray InsightCard Component maadaama aad u isticmaashay section-ka cusub
const InsightCard = ({ img, tag, title, desc }) => (
  <div className="group cursor-pointer">
    <div className="relative h-64 rounded-[32px] overflow-hidden mb-6">
      <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-4 left-4">
        <span className="bg-white/90 backdrop-blur text-[#065F46] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
          {tag}
        </span>
      </div>
    </div>
    <h3 className="text-2xl font-black mb-3 text-gray-900 group-hover:text-[#065F46] transition-colors leading-tight">
      {title}
    </h3>
    <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
      {desc}
    </p>
    <div className="flex items-center gap-2 text-[#065F46] font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
      Read More <ArrowRight size={14} />
    </div>
  </div>
);

const Home = () => {
  const activitiesData = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1523240682765-609e817590ff?auto=format&fit=crop&w=800",
      title: "Booqashada Iskuulka Barkhadle",
      desc: "Booqasho indho-indheyn ah oo aan ku tagnay Dugsiga Hoose/Dhexe ee Barkhadle ee magaalada Gaalkacyo, Mudug.",
      tag: "Education"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1517649763962-0c6234278a0b?auto=format&fit=crop&w=800",
      title: "Kulaanka Dhallinyarada Sport-ga",
      desc: "Kulan Muqdisho ugu qabannay dhallinyarada Sport-ga degmada Goldogob xilli ay u tartamayeen koobka gobolka Mudug.",
      tag: "Sports"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800",
      title: "Doorashada Hoggaanka Cusub",
      desc: "Waxaa si guul ah inoogu soo dhammaatay doorashadii ururka, taas oo uu ku guulaystay Gudoomiye Abdinasir Hire.",
      tag: "Leadership"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800",
      title: "Kulan Madaxda Qaranka",
      desc: "Kulan aan la qaadanay Xildhibaan Fordows iyo Xildhibaan Ahmed Taajir, annagoo uga warbixinnay waxqabadka SYADA.",
      tag: "Governance"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800",
      title: "Isbarashada Team-ka SYADA",
      desc: "Kulan is-xog-wareysi iyo isbarasho ah oo u qabsoomay xubnaha kooxda si loo xoojiyo wada-shaqaynta.",
      tag: "Internal"
    }
  ];

  return (
    <div className="bg-white font-sans text-[#1A1A1A]">
      
      {/* 1. Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase mb-6 inline-block">
            Official Portal
          </span>
          <h1 className="text-6xl lg:text-7xl font-black leading-[1.1] mb-8">
            Dhisidda <br /> <span className="text-[#065F46] italic">Dhallinyarada</span> <br /> Hormuudka ah.
          </h1>
          <p className="text-gray-500 text-lg mb-10 max-w-lg leading-relaxed">
            SYADA waa urur u taagan xoojinta iyo horumarinta dhallinyarada Soomaaliyeed, annagoo ka madax-bannaan siyaasad iyo qabiil.
          </p>
          <button className="bg-[#065F46] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#043d2d] transition-all shadow-lg shadow-green-900/20">
            Join the Movement
          </button>
        </div>
        <div className="relative">
          <div className="rounded-[40px] overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800" 
              className="w-full h-[550px] object-cover" 
              alt="SYADA Team" 
            />
          </div>
         
        </div>
      </section>

      {/* 2. Recent Activities Section */}
      <section className="bg-gray-50/50 py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 text-center lg:text-left">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Waxyabihii Inoo Qabsoomay</p>
            <h2 className="text-5xl font-black text-gray-900">Recent Activities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {activitiesData.map((activity) => (
              <div key={activity.id} className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={activity.image} 
                    alt={activity.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#065F46] text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                      {activity.tag}
                    </span>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 leading-tight group-hover:text-[#065F46] transition-colors">
                    {activity.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {activity.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW SECTION: Knowledge Base */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4">Knowledge Base</p>
              <h2 className="text-5xl font-black">Latest Insights</h2>
            </div>
            <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#065F46] hover:gap-4 transition-all">
              View All Articles <ExternalLink size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <InsightCard 
              img="https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=500"
              tag="Technology & Economy"
              title="The Digital Leap: How Somali Youth are Redefining Fintech"
              desc="Exploring how grassroots innovation is making Somalia a hub for mobile payment systems."
            />
            <InsightCard 
              img="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=500"
              tag="Governance & Policy"
              title="Navigating Governance: Lessons from Young Policy Makers"
              desc="A deep dive into the challenges and triumphs of youth involvement in local administration."
            />
            <InsightCard 
              img="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500"
              tag="Education & Skills"
              title="Academic Frontiers: The Power of International Mentorship"
              desc="How remote mentorship programs are connecting Somali students with global big-league professors."
            />
          </div>
        </div>
      </section>

      {/* 3. CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-[#065F46] rounded-[50px] p-16 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-5xl lg:text-6xl font-black mb-8">Ready to lead <br /> the change?</h2>
            <p className="text-green-100/70 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
              Ku soo biir ururka SYADA si aad qayb uga noqoto horumarka iyo wacyigelinta dhallinyarada Soomaaliyeed.
            </p>
            <button className="bg-white text-[#065F46] px-10 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-xl">
              Join as a Member
            </button>
          </div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
      </section>
      <About/>
      <Footer />
    </div>
  );
};

export default Home;
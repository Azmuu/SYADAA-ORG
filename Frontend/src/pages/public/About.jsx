import React from 'react';
import { CheckCircle2, Lightbulb, Globe, Users, Target, Eye } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white">
      {/* Header Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-[10px] font-bold text-[#065F46] uppercase tracking-[0.3em] mb-4">Our Purpose</p>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-8 text-gray-900">
            Empowering <span className="text-[#065F46]">Somali Youth</span> for a better future.
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            SYADA waa urur aan dawli ahayn oo u taagan horumarinta dhallinyarada Soomaaliyeed, isagoo ka madax-bannaan siyaasad, qabiil, iyo diin. Waxaan u shaqaynaa si aan u abuurno mustaqbal ay dhallinyaradu hoggaamin karaan horumarkooda.
          </p>
        </div>
        <div className="relative">
          <div className="rounded-3xl overflow-hidden h-[450px] shadow-2xl">
            {/* Waxaad halkan geli kartaa sawirka dhabta ah ee kooxda SYADA */}
            <img src="image1.png" className="w-full h-full object-cover" alt="SYADA Community" />
          </div>
         
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-gray-50/50 py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="p-10 rounded-[40px] bg-white border border-gray-100 shadow-sm">
            <div className="w-12 h-12 bg-[#065F46] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-900/10">
              <Target className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-black mb-6 text-gray-900">Our Mission</h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              SYADA Mission waa in la dhisao bulsho dhallinyarada udub-dhexaad u tahay, anagoo xoojinayna kuwa aan fursadaha haysan iyadoo loo marayo isboortiga, aqoon-kororsiga, iyo waxbarashada[cite: 17].
            </p>
          </div>

          {/* Vision Card */}
          <div className="p-10 rounded-[40px] bg-gray-900 text-white relative overflow-hidden">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md">
              <Eye className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-black mb-6 text-white">Our Vision</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Inaan aragno nolosha dhallinyarada oo loo beddelay qaab togan, iyo bulsho ay dhallinyaradu awood u leeyihiin inay fududeeyaan horumarkooda iyo kan bulshadooda[cite: 15].
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <img src="image.png.jpeg" className="rounded-3xl shadow-lg" alt="Team Work" />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl font-black mb-6 text-gray-900">Our Story</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-[#065F46] pl-6">
                <h3 className="font-bold text-xl mb-2 text-gray-800">2011: The Beginning</h3>
                <p className="text-gray-500 leading-relaxed">
                  SYADA waxaa la aasaasay Febraayo 2011. Waxaa isugu yimid koox aqoonyahanno dhallinyaro ah oo garowsaday baahida weyn ee loo qabo in dhallinyaradu door ka qaataan horumarka dalkooda[cite: 11].
                </p>
              </div>
              <p className="text-gray-500 leading-relaxed">
                Maanta, ururku wuxuu ka hawlgalaa gobollada Benadir, Mudug, Nugaal, Bari iyo Lower Jubba [cite: 5, 41], isagoo isku xira in ka badan 191 xubnood[cite: 41].
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center border-t border-gray-100">
        <h2 className="text-4xl font-black mb-4 text-gray-900">Our Core Values</h2>
        <p className="text-gray-400 mb-16 max-w-xl mx-auto">Qiimaha aan ku dhisannahay ee hagaya shaqadeena maalin laha ah[cite: 29].</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <PillarCard icon={<CheckCircle2 className="text-[#065F46]"/>} title="Integrity" desc="Amaanada iyo hufnaanta waa aasaaska shaqadeena[cite: 30, 34]." />
          <PillarCard icon={<Users className="text-[#065F46]"/>} title="Inclusiveness" desc="Wada-jirka dhallinyarada iyadoon loo eegin kala duwanaanshaha[cite: 32]." />
          <PillarCard icon={<Lightbulb className="text-white"/>} title="Responsibility" desc="Mas'uuliyad ka saaran u adeegidda bulshada iyo deegaanka[cite: 31]." isDark={true} />
          <PillarCard icon={<Globe className="text-[#065F46]"/>} title="Equity" desc="Sinaanta fursadaha dhammaan dhallinyarada[cite: 30]." />
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-100 bg-gray-50/30">
        <div className="mb-16 text-center lg:text-left">
          <h2 className="text-4xl font-black text-gray-900">Executive Management</h2>
          <p className="text-gray-400 mt-2">Hoggaanka fulinta ee SYADA.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          <LeaderCard name="Asma Cigaal Mohamud" role="Madaxa Maaliyada Ururka" img="asma.jpeg" />
          <LeaderCard name="Jama Abdullahi Omar" role="Afhayeenka Ururka" img="jamac.jpeg.jpeg" />
          <LeaderCard name="Ayanle Abdiaziz Mohamud" role="Vice Chair Executive" img="https://i.pravatar.cc/300?u=ayanle" />
          <LeaderCard name="Saabirin Ali Mohamed" role="Head of Finance" img="https://i.pravatar.cc/300?u=saabirin" />
        </div>
      </section>
    </div>
  );
};

/* --- Component Helpers --- */

const PillarCard = ({ icon, title, desc, isDark }) => (
  <div className={`p-8 rounded-3xl text-left transition-all ${isDark ? 'bg-[#065F46] text-white' : 'bg-white hover:bg-gray-50 border border-gray-100 hover:shadow-xl'}`}>
    <div className={`mb-6 p-3 inline-block rounded-xl ${isDark ? 'bg-white/10' : 'bg-gray-50 shadow-sm'}`}>{icon}</div>
    <h3 className="font-bold text-lg mb-3">{title}</h3>
    <p className={`text-sm leading-relaxed ${isDark ? 'opacity-70' : 'text-gray-500'}`}>{desc}</p>
  </div>
);

const LeaderCard = ({ name, role, img }) => (
  <div className="group bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 text-center">
    {/* Image Container */}
    <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-md">
      <img 
        src={img} 
        alt={name} 
        className="w-full h-full object-cover" 
      />
    </div>
    
    {/* Info */}
    <div className="space-y-1">
      <h3 className="text-xl font-black text-gray-900 leading-tight">{name}</h3>
      <p className="text-[11px] font-bold text-[#065F46] uppercase tracking-[0.15em]">{role}</p>
    </div>
  </div>
);

export default About;
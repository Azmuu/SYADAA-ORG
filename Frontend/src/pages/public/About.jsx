import React from 'react';
import { CheckCircle2, Lightbulb, Globe, Users, Target, Eye } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white">
      {/* Header Section */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">Our purpose</p>
          <h1 className="mb-8 text-4xl font-semibold leading-tight tracking-tight text-neutral-900 lg:text-5xl">
            Empowering <span className="text-brand">Somali youth</span> for a better future.
          </h1>
          <p className="text-lg leading-relaxed text-neutral-500">
            SYADA waa urur aan dawli ahayn oo u taagan horumarinta dhallinyarada Soomaaliyeed, isagoo ka madax-bannaan siyaasad, qabiil, iyo diin. Waxaan u shaqaynaa si aan u abuurno mustaqbal ay dhallinyaradu hoggaamin karaan horumarkooda.
          </p>
        </div>
        <div className="relative">
          <div className="h-[450px] overflow-hidden rounded-[2rem] shadow-xl">
            <img src="/image1.png" className="h-full w-full object-cover" alt="SYADA Community" />
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="border-y border-brand/10 bg-brand-muted py-20 lg:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-5 md:grid-cols-2 lg:px-8">
          {/* Mission Card */}
          <div className="rounded-[2rem] border border-brand/10 bg-white p-10 shadow-sm">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand shadow-sm">
              <Target className="text-white" size={24} />
            </div>
            <h2 className="mb-6 text-3xl font-semibold tracking-tight text-brand">Our Mission</h2>
            <p className="text-lg leading-relaxed text-neutral-500">
              SYADA Mission waa in la dhisao bulsho dhallinyarada udub-dhexaad u tahay, anagoo xoojinayna kuwa aan fursadaha haysan iyadoo loo marayo isboortiga, aqoon-kororsiga, iyo waxbarashada[cite: 17].
            </p>
          </div>

          {/* Vision Card */}
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-logo-navy to-logo-navy-dark p-10 text-white">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-logo-gold/20 backdrop-blur-md">
              <Eye className="text-logo-gold" size={24} />
            </div>
            <h2 className="mb-6 text-3xl font-semibold tracking-tight">Our Vision</h2>
            <p className="text-lg leading-relaxed text-neutral-300">
              Inaan aragno nolosha dhallinyarada oo loo beddelay qaab togan, iyo bulsho ay dhallinyaradu awood u leeyihiin inay fududeeyaan horumarkooda iyo kan bulshadooda[cite: 15].
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <img src="/image.png.jpeg" className="rounded-[2rem] shadow-lg" alt="Team Work" />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="mb-6 text-3xl font-semibold tracking-tight text-brand lg:text-4xl">Our Story</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-brand pl-6">
                <h3 className="mb-2 text-xl font-semibold text-neutral-800">2011: The Beginning</h3>
                <p className="leading-relaxed text-neutral-500">
                  SYADA waxaa la aasaasay Febraayo 2011. Waxaa isugu yimid koox aqoonyahanno dhallinyaro ah oo garowsaday baahida weyn ee loo qabo in dhallinyaradu door ka qaataan horumarka dalkooda[cite: 11].
                </p>
              </div>
              <p className="leading-relaxed text-neutral-500">
                Maanta, ururku wuxuu ka hawlgalaa gobollada Benadir, Mudug, Nugaal, Bari iyo Lower Jubba [cite: 5, 41], isagoo isku xira in ka badan 191 xubnood[cite: 41].
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="mx-auto max-w-6xl border-t border-brand/10 px-5 py-20 text-center lg:px-8 lg:py-24">
        <h2 className="mb-4 text-3xl font-semibold tracking-tight text-brand lg:text-4xl">Our Core Values</h2>
        <p className="mx-auto mb-14 max-w-xl text-neutral-500">Qiimaha aan ku dhisannahay ee hagaya shaqadeena maalin laha ah[cite: 29].</p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <PillarCard icon={<CheckCircle2 className="text-brand" />} title="Integrity" desc="Amaanada iyo hufnaanta waa aasaaska shaqadeena[cite: 30, 34]." />
          <PillarCard icon={<Users className="text-brand" />} title="Inclusiveness" desc="Wada-jirka dhallinyarada iyadoon loo eegin kala duwanaanshaha[cite: 32]." />
          <PillarCard icon={<Lightbulb className="text-white" />} title="Responsibility" desc="Mas'uuliyad ka saaran u adeegidda bulshada iyo deegaanka[cite: 31]." isDark={true} />
          <PillarCard icon={<Globe className="text-brand" />} title="Equity" desc="Sinaanta fursadaha dhammaan dhallinyarada[cite: 30]." />
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="border-t border-brand/10 bg-brand-muted py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mb-12 text-center lg:text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-brand lg:text-4xl">Executive Management</h2>
            <p className="mt-2 text-neutral-500">Hoggaanka fulinta ee SYADA.</p>
          </div>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            <LeaderCard name="Abdinasir Hire Ismail" role="Gudoomiyaha Ururka SYADA Organization" img="/gudomiye.jpeg" />
              <LeaderCard name="Abdulaahi Bashiir Abdulaahi" role="Gudoomiye ku xigeenka Ururka Syada Organization" img="/abdalla.jpeg" />
             <LeaderCard name="Asma Cigaal Mohamud" role="Madaxa Maaliyada Ururka" img="/asma.jpeg" />
            <LeaderCard name="Abdirashid Abdirahmaan Maxamed" role="Madaxa horumarinta mashaariicda ururka" img="/abdi.jpeg" />
            <LeaderCard name="Macruuf Axmed Jamac" role="Madaxa arimaha dacwada iyo wacyi gelinta" img="/macruf.jpeg" />
            <LeaderCard name="Jama Abdullahi Omar" role="Afhayeenka Ururka" img="/jamac.jpeg.jpeg" />
            <LeaderCard name="Isse Adan Ahmed" role="Madaxa Arimaha Cafimaadka" img="/isse.jpeg" />
            <LeaderCard name="Ishak Abdirizak Isse (Gorod)" role="Madaxa ciyaaraha iyo isdhexgalka dhalinyarada" img="/gorod.jpeg" />
            <LeaderCard name="Abdiaziz Salah Ismail " role="Madaxa Arrimaha Bulshada SYDa Organization" img="/salah.jpeg" />
          </div>
        </div>
      </section>
    </div>
  );
};

/* --- Component Helpers --- */

const PillarCard = ({ icon, title, desc, isDark }) => (
  <div
    className={`rounded-3xl p-8 text-left transition-all ${
      isDark ? 'bg-brand text-white' : 'border border-brand/10 bg-white hover:shadow-md'
    }`}
  >
    <div className={`mb-6 inline-block rounded-xl p-3 ${isDark ? 'bg-white/10' : 'bg-neutral-100'}`}>{icon}</div>
    <h3 className="mb-3 text-lg font-semibold">{title}</h3>
    <p className={`text-sm leading-relaxed ${isDark ? 'text-white/70' : 'text-neutral-500'}`}>{desc}</p>
  </div>
);

const LeaderCard = ({ name, role, img }) => (
  <div className="group rounded-[2rem] border border-brand/10 bg-white p-8 text-center shadow-sm transition-all duration-300 hover:shadow-md">
    <div className="relative mx-auto mb-6 h-48 w-48 overflow-hidden rounded-full border-4 border-white shadow-md">
      <img 
        src={img} 
        alt={name} 
        className="w-full h-full object-cover" 
      />
    </div>
    
    {/* Info */}
    <div className="space-y-1">
      <h3 className="text-xl font-semibold leading-tight text-neutral-900">{name}</h3>
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-brand">{role}</p>
    </div>
  </div>
);

export default About;
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, ArrowUpRight } from 'lucide-react';
import Footer from '../../components/Footer';
import About from './About';
import activitiesManifest from '../../data/activities-manifest.json';
import { publicFolderFile } from '../../lib/publicMediaUrl';

const { activities: publicActivities } = activitiesManifest;

/** Clips in `public/vedio/` — they play in order, then loop to the first (hero replaces the old photo rotator) */
const HERO_VIDEOS = [
  'home.mp4',
  'WhatsApp Video 2026-04-15 at 4.49.03 AM.mp4',
  'WhatsApp Video 2026-04-15 at 4.49.03 AM (1).mp4',
  'WhatsApp Video 2026-04-18 at 12.44.38 AM.mp4',
  'WhatsApp Video 2026-04-25 at 9.49.53 PM.mp4',
].map((name) => publicFolderFile('vedio', name));

const ActivityImageLoop = ({ activity }) => {
  const urls = useMemo(
    () => activity.images.map((f) => publicFolderFile(activity.folder, f)),
    [activity.folder, activity.images]
  );
  const [i, setI] = useState(0);

  useEffect(() => {
    if (urls.length <= 1) return;
    const t = setInterval(() => {
      setI((x) => (x + 1) % urls.length);
    }, 3500);
    return () => clearInterval(t);
  }, [urls.length]);

  if (!urls.length) {
    return <div className="h-52 bg-brand-muted" />;
  }

  return (
    <div className="relative h-52 overflow-hidden bg-black/5">
      {urls.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt=""
          loading={idx === 0 ? 'eager' : 'lazy'}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            idx === i ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        />
      ))}
      {urls.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 z-10 flex justify-center gap-1">
          {urls.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
              aria-hidden
            />
          ))}
        </div>
      )}
    </div>
  );
};

const InsightCard = ({ img, tag, title, desc }) => (
  <div className="group cursor-pointer">
    <div className="relative mb-5 h-56 overflow-hidden rounded-3xl">
      <img src={img} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute left-4 top-4">
        <span className="rounded-full border border-brand/15 bg-brand-soft/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand shadow-sm backdrop-blur">
          {tag}
        </span>
      </div>
      <button
        type="button"
        className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand shadow-md ring-1 ring-brand/10 transition-transform hover:scale-105"
        aria-label="Open"
      >
        <ArrowUpRight size={18} />
      </button>
    </div>
    <h3 className="mb-2 text-lg font-semibold leading-snug text-neutral-900 transition-colors group-hover:text-brand">{title}</h3>
    <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-neutral-500">{desc}</p>
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand transition-all group-hover:gap-3">
      Read more <ArrowRight size={14} />
    </div>
  </div>
);

const Home = () => {
  const [heroVideoIdx, setHeroVideoIdx] = useState(0);

  useEffect(() => {
    if (window.location.hash === '#activities') {
      requestAnimationFrame(() => {
        document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, []);

  const whatWeDo = [
    {
      title: 'Waxbarashada & isboortiga',
      desc: 'Booqashooyinka iskuulada iyo kulanada dhallinyarada sport-ga si loo xoojiyo aqoon iyo caafimaad.',
      img: 'https://images.unsplash.com/photo-1523240682765-609e817590ff?auto=format&fit=crop&w=600',
    },
    {
      title: 'Hoggaanka & doorashooyinka',
      desc: 'Hagitaan hoggaamineed iyo habayn ka madax bannaan oo u adeegaya dhallinyarada.',
      img: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600',
    },
    {
      title: 'Wacyigelinta & shirarka',
      desc: 'Kulanka madaxda iyo wada-xaajoodka si loo faafiyo waxqabadka SYADA.',
      img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600',
    },
    {
      title: 'Iskaashi & xubinnimo',
      desc: 'Ku soo biir 191+ xubnood oo ka shaqeeya gobollada kala duwan.',
      img: '/image1.png',
    },
  ];

  return (
    <div className="bg-brand-muted font-sans text-neutral-900 antialiased">
      {/* Hero — background video(s) from public/vedio/ */}
      <section className="mx-auto max-w-6xl px-5 pb-6 pt-8 lg:px-8 lg:pb-10 lg:pt-10">
        <div className="relative overflow-hidden rounded-[2rem] lg:rounded-[2.25rem]">
          {HERO_VIDEOS.length > 0 ? (
            <div className="relative h-[min(78vh,640px)] w-full bg-black">
              <video
                key={HERO_VIDEOS[heroVideoIdx]}
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop={HERO_VIDEOS.length < 2}
                playsInline
                controls={false}
                preload="auto"
                poster="/image1.png"
                onEnded={() => {
                  if (HERO_VIDEOS.length > 1) {
                    setHeroVideoIdx((x) => (x + 1) % HERO_VIDEOS.length);
                  }
                }}
              >
                <source src={HERO_VIDEOS[heroVideoIdx]} type="video/mp4" />
              </video>
            </div>
          ) : (
            <img
              src="/image1.png"
              alt="SYADA community"
              className="h-[min(78vh,640px)] w-full object-cover"
            />
          )}
          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/75 via-black/35 to-black/20" />
          {HERO_VIDEOS.length > 1 && (
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
              {HERO_VIDEOS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setHeroVideoIdx(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === heroVideoIdx ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Play clip ${i + 1}`}
                />
              ))}
            </div>
          )}
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 pb-10 md:p-12 md:pb-12">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80">Official portal</p>
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl">
              Dhisidda dhallinyarada hormuudka ah.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
              SYADA waa urur u taagan xoojinta iyo horumarinta dhallinyarada Soomaaliyeed, annagoo ka madax-bannaan siyaasad iyo qabiil.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col justify-between rounded-3xl border border-brand/10 bg-brand-soft p-8">
            <div>
              <p className="text-4xl font-semibold tracking-tight text-brand md:text-5xl">191+</p>
              <p className="mt-2 text-sm font-medium text-neutral-500">Xubno & saaxiibo</p>
            </div>
            <div className="mt-8 flex -space-x-2">
              <img className="h-10 w-10 rounded-full border-2 border-brand-soft object-cover" src="/asma.jpeg" alt="" />
              <img className="h-10 w-10 rounded-full border-2 border-brand-soft object-cover" src="/jamac.jpeg.jpeg" alt="" />
              <img className="h-10 w-10 rounded-full border-2 border-brand-soft object-cover" src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=100" alt="" />
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-soft bg-white text-[10px] font-semibold text-brand">
                +++
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80"
              alt=""
              className="absolute inset-0 h-full w-full object-cover grayscale"
            />
            <div className="absolute inset-0 bg-logo-navy/60" />
            <div className="relative flex h-full min-h-[220px] flex-col justify-end p-8 text-white">
              <p className="text-4xl font-semibold md:text-5xl">5+</p>
              <p className="mt-2 text-sm font-medium text-white/80">Gobol oo aan ka shaqeyno</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-logo-navy to-logo-navy-dark p-8 text-white">
            <p className="relative z-10 text-4xl font-semibold md:text-5xl">15+</p>
            <p className="relative z-10 mt-2 text-sm font-medium text-white/75">Sano oo adeeg</p>
            <span className="pointer-events-none absolute -bottom-4 -right-2 select-none text-7xl font-semibold tracking-tighter text-white/[0.08]">
              SYADA
            </span>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="border-t border-brand/10 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-brand md:text-4xl">What we do</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-neutral-500">
            Waxaan u shaqeynaa dhallinyarada iyada oo aan loo eegin siyaasad, qabiil, ama diin — horumar, isboorti, aqoon, iyo hoggaan.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whatWeDo.map((item) => (
              <div key={item.title} className="group overflow-hidden rounded-3xl border border-brand/5 bg-brand-muted">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={item.img} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <button
                    type="button"
                    className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand shadow-md ring-1 ring-brand/10"
                    aria-label="More"
                  >
                    <ArrowUpRight size={18} />
                  </button>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-brand">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent activities */}
      <section id="activities" className="scroll-mt-24 border-t border-brand/10 py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">Waxyabihii inoo qabsoomay</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">Recent activities</h2>
            </div>
            <Link to="/about" className="text-sm font-medium text-brand underline-offset-4 hover:underline">
              Our full story
            </Link>
          </div>

          {publicActivities.length === 0 && (
            <p className="mb-6 rounded-2xl border border-dashed border-brand/20 bg-white px-4 py-6 text-center text-sm text-neutral-500">
              Add activity folders (photos) under <code className="rounded bg-brand-muted px-1.5 py-0.5 text-xs">public/</code> on the
              site, then run{" "}
              <code className="rounded bg-brand-muted px-1.5 py-0.5 text-xs">node scripts/generate-activities-manifest.mjs</code> in the
              Frontend to refresh the list. The <code className="text-xs">vedio</code> folder is ignored.
            </p>
          )}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {publicActivities.map((activity) => (
              <article
                key={activity.id}
                className="overflow-hidden rounded-3xl border border-brand/10 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative">
                  <span className="absolute left-4 top-4 z-20 rounded-full bg-brand px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-white shadow-sm">
                    {activity.tag}
                  </span>
                  <ActivityImageLoop activity={activity} />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold leading-snug text-neutral-900">{activity.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">{activity.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Knowledge base */}
      <section className="border-t border-brand/10 bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">Knowledge base</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-brand md:text-4xl">Latest insights</h2>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand"
            >
              View all articles <ExternalLink size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <InsightCard
              img="https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=500"
              tag="Technology & economy"
              title="The Digital Leap: How Somali Youth are Redefining Fintech"
              desc="Exploring how grassroots innovation is making Somalia a hub for mobile payment systems."
            />
            <InsightCard
              img="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=500"
              tag="Governance & policy"
              title="Navigating Governance: Lessons from Young Policy Makers"
              desc="A deep dive into the challenges and triumphs of youth involvement in local administration."
            />
            <InsightCard
              img="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=500"
              tag="Education & skills"
              title="Academic Frontiers: The Power of International Mentorship"
              desc="How remote mentorship programs are connecting Somali students with global big-league professors."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand via-brand-dark to-logo-navy-dark px-8 py-14 text-center text-white md:px-16 md:py-16">
          <div className="relative z-10">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">Ready to lead the change?</h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
              Ku soo biir ururka SYADA si aad qayb uga noqoto horumarka iyo wacyigelinta dhallinyarada Soomaaliyeed.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex rounded-full bg-logo-gold px-8 py-3 text-sm font-semibold text-logo-navy-dark shadow-sm transition-colors hover:brightness-105"
              >
                Join as a member
              </Link>
              <Link
                to="/about"
                className="inline-flex rounded-full border border-white/35 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                About SYADA
              </Link>
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-logo-gold/10 blur-3xl" />
        </div>
      </section>

      <About />
      <Footer />
    </div>
  );
};

export default Home;

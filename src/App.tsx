import { useEffect, useMemo, useState } from 'react';
import {
  Car,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import { AiSkinAdvisor } from './components/AiSkinAdvisor';
import { Header } from './components/Header';
import {
  CLINIC_IMAGES,
  PATIENT_REVIEWS,
  SERVICE_PACKAGES,
  SPECIALISTS,
  UI_COPY,
} from './data/clinicContent';
import {
  buildWhatsAppUrl,
  CLINIC_LAT,
  CLINIC_LNG,
  CLINIC_MAPS_DIRECTIONS_URL,
  CLINIC_MAPS_EMBED_URL,
  CLINIC_MAPS_URL,
  CLINIC_PHONE_DISPLAY,
  CLINIC_PHONE_TEL,
  CLINIC_PLUS_CODE,
  type Language,
} from './utils/clinicLogic';

type PackageFilter = 'all' | 'laser' | 'skin';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [packageFilter, setPackageFilter] = useState<PackageFilter>('all');

  const isAr = lang === 'ar';
  const copy = UI_COPY[lang];

  // Sync HTML dir, lang, dynamic canonical URL, and bilingual SEO/OpenGraph metadata
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';

    const title = isAr
      ? 'جراند كلينك طبربور – عيادة الليزر والجلدية في عمّان'
      : 'Grande Clinic Tabarbour – Laser & Dermatology in Amman';
    const description = isAr
      ? 'إزالة الشعر بالليزر بدون ألم بتقنية التبريد الفائق وعناية بالبشرة في شارع طارق، طبربور، عمّان. تقييم ٤.٥★ (+١,٢٠٠ تقييم). احجزي مع دانا، قمر أو دعاء.'
      : 'Painless cryo-cooling laser hair removal & medical dermatology on Tarek St., Tabarbour, Amman. Rated 4.5★ (1,200+ reviews). Book with Dana, Qamar & Duaa.';

    document.title = title;

    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector<HTMLMetaElement>(selector);
      if (el) el.content = content;
    };

    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:locale"]', isAr ? 'ar_JO' : 'en_JO');
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);

    if (typeof window !== 'undefined' && window.location.protocol.startsWith('http')) {
      const canonicalUrl = `${window.location.origin}${window.location.pathname}`;
      const canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (canonicalLink) canonicalLink.href = canonicalUrl;
      setMeta('meta[property="og:url"]', canonicalUrl);
    }
  }, [lang, isAr]);

  const filteredPackages = useMemo(() => {
    if (packageFilter === 'laser') {
      return SERVICE_PACKAGES.filter(
        (p) => p.id === 'full-body' || p.id === 'targeted-laser'
      );
    }
    if (packageFilter === 'skin') {
      return SERVICE_PACKAGES.filter(
        (p) => p.id === 'facial-rejuvenation' || p.id === 'free-assessment'
      );
    }
    return SERVICE_PACKAGES;
  }, [packageFilter]);

  const primaryWaUrl = buildWhatsAppUrl(
    isAr
      ? 'مرحباً جراند كلينك طبربور، أود الاستفسار وحجز موعد جلسة ليزر أو بشرة.'
      : 'Hello Grande Clinic Tabarbour, I would like to book a laser consultation and appointment.'
  );

  const locationPinWaUrl = buildWhatsAppUrl(
    isAr
      ? 'مرحباً جراند كلينك، يرجى إرسال موقع العيادة (Location Pin) في شارع طارق بطبربور.'
      : 'Hello Grande Clinic, could you please share the live WhatsApp location pin for Tarek St., Tabarbour?'
  );

  return (
    <div id="top" className="min-h-screen bg-base-100 text-base-content flex flex-col">
      <Header
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'en' ? 'ar' : 'en'))}
        whatsappUrl={primaryWaUrl}
      />

      <main className="flex-1">
        {/* ============================================================
            HERO SECTION — CLINICAL HAUTE COUTURE
           ============================================================ */}
        <section className="relative overflow-hidden pt-8 pb-14 lg:pt-12 lg:pb-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            {/* Unboxed Clean Clinical Meta Line (Zero-Pill Discipline) */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-base-300 pb-4 text-xs font-medium text-base-content/75">
              <div className="flex items-center gap-2">
                <Star className="h-3.5 w-3.5 fill-secondary text-secondary shrink-0" />
                <span>{copy.heroKicker}</span>
              </div>
              <a
                href={CLINIC_PHONE_TEL}
                dir="ltr"
                className="font-semibold text-primary hover:text-secondary transition-colors tabular-nums"
              >
                {CLINIC_PHONE_DISPLAY}
              </a>
            </div>

            {/* Asymmetric 12-Col Editorial Hero Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Editorial Column (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-7">
                <div className="space-y-5">
                  <div className="flex items-center gap-3 text-xs font-semibold tracking-wider text-secondary">
                    <span className="h-px w-8 bg-secondary" aria-hidden="true" />
                    <span>
                      {isAr
                        ? 'عيادة طبية مرخصة للجلدية والليزر والتجميل'
                        : 'Medical Dermatology & Precision Laser Suite'}
                    </span>
                  </div>

                  <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.45rem] font-semibold tracking-tight text-primary leading-[1.12] text-balance">
                    {copy.heroTitleLead}{' '}
                    <span className={isAr ? 'text-secondary' : 'italic font-normal text-secondary'}>
                      {copy.heroTitleAccent}
                    </span>{' '}
                    {copy.heroTitleTail}
                  </h1>

                  <p className="max-w-2xl text-base sm:text-lg text-base-content/75 leading-relaxed">
                    {copy.heroSubtitle}
                  </p>

                  {/* Primary Conversion Anchor CTA Group */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                    <a
                      href={primaryWaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-accent btn-lg rounded-full px-8 text-white font-semibold whatsapp-shadow whitespace-nowrap"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>{copy.ctaWhatsApp}</span>
                    </a>

                    <a
                      href={CLINIC_PHONE_TEL}
                      className="btn btn-outline border-base-300 btn-lg rounded-full px-6 text-primary font-semibold hover:bg-primary hover:border-primary hover:text-primary-content whitespace-nowrap"
                    >
                      <Phone className="h-4 w-4 text-secondary" />
                      <span dir="ltr" className="tabular-nums">
                        {CLINIC_PHONE_DISPLAY}
                      </span>
                    </a>
                  </div>

                  <p className="text-xs text-base-content/65">{copy.heroNote}</p>
                </div>

                {/* On-Duty Specialists Trust Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-base-300 bg-white px-4 py-3.5 text-xs sm:text-sm max-w-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2 rtl:space-x-reverse">
                      {SPECIALISTS.map((sp) => (
                        <span
                          key={sp.id}
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ring-2 ring-white ${sp.accentClass}`}
                        >
                          {sp.initials[lang]}
                        </span>
                      ))}
                    </div>
                    <div>
                      <div className="font-semibold text-primary">
                        {isAr ? 'الأخصائيات: دانا، قمر، دعاء' : 'Specialists Dana, Qamar & Duaa'}
                      </div>
                      <div className="text-xs text-base-content/65">
                        {isAr ? 'مرخصات ومتواجدات اليوم بالعيادة' : 'Certified female practitioners on duty'}
                      </div>
                    </div>
                  </div>
                  <a
                    href="#ai-advisor"
                    className="text-xs font-semibold text-secondary hover:underline whitespace-nowrap shrink-0"
                  >
                    {isAr ? 'مطابقة بشرتكِ' : 'Match skin protocol'}
                  </a>
                </div>
              </div>

              {/* Clinical Photography Visual Showcase Column (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                <figure className="group relative h-60 sm:h-56 lg:h-[250px] overflow-hidden rounded-[1.75rem] border brass-hairline bg-base-200 clinic-card-shadow">
                  <img
                    src={CLINIC_IMAGES.laserSession}
                    alt={
                      isAr
                        ? 'جلسة ليزر دقيقة مع تبريد فائق في جراند كلينك طبربور'
                        : 'Precision cooling laser skincare session at Grande Clinic Tabarbour'
                    }
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <figcaption className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#0d1c18]/85 via-[#0d1c18]/25 to-transparent p-5 text-white">
                    <span className="font-display text-lg font-semibold leading-snug">
                      {copy.photo1Title}
                    </span>
                    <span className="text-xs text-white/85 mt-0.5">{copy.photo1Sub}</span>
                  </figcaption>
                </figure>

                <figure className="group relative h-52 sm:h-56 lg:h-[215px] overflow-hidden rounded-[1.75rem] border border-base-300 bg-base-200 clinic-card-shadow">
                  <img
                    src={CLINIC_IMAGES.luxurySuite}
                    alt={
                      isAr
                        ? 'جناح العلاج الفاخر والخاص في جراند كلينك طبربور عمّان'
                        : 'Private luxury aesthetic treatment suite at Grande Clinic Tabarbour'
                    }
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <figcaption className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#0d1c18]/85 via-[#0d1c18]/25 to-transparent p-5 text-white">
                    <span className="font-display text-lg font-semibold leading-snug">
                      {copy.photo2Title}
                    </span>
                    <span className="text-xs text-white/85 mt-0.5">{copy.photo2Sub}</span>
                  </figcaption>
                </figure>
              </div>
            </div>

            {/* Full-Width 4-Column Verified Clinic Stats Strip */}
            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x rtl:lg:divide-x-reverse divide-base-300 rounded-3xl border border-base-300 bg-white p-5 sm:p-6 clinic-card-shadow">
              {copy.stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`flex flex-col gap-1 ${
                    index > 0 ? 'pt-3 lg:pt-0 lg:ps-6' : ''
                  } ${index < 3 ? 'pb-3 lg:pb-0 lg:pe-6' : ''}`}
                >
                  <span className="font-display text-2xl font-bold text-primary tabular-nums">
                    {stat.value}
                  </span>
                  <span className="text-xs text-base-content/70 leading-snug">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 01 — LASER PACKAGES & AESTHETIC PROTOCOLS
           ============================================================ */}
        <section id="laser-packages" className="w-full py-16 lg:py-20 bg-base-200 border-y border-base-300">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div className="max-w-2xl space-y-2">
                <p className="text-xs font-semibold tracking-wider text-secondary">
                  {copy.servicesKicker}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary text-balance">
                  {copy.servicesTitle}
                </h2>
                <p className="text-sm sm:text-base text-base-content/75 leading-relaxed">
                  {copy.servicesSub}
                </p>
              </div>

              {/* Functional Category Filter Tabs */}
              <div
                role="tablist"
                aria-label={isAr ? 'تصفية الباقات' : 'Filter treatment packages'}
                className="tabs tabs-box bg-white p-1 border border-base-300 self-start md:self-auto"
              >
                {(
                  [
                    { id: 'all', en: 'All Protocols', ar: 'جميع الباقات' },
                    { id: 'laser', en: 'Laser Hair Removal', ar: 'إزالة الشعر بالليزر' },
                    { id: 'skin', en: 'Skin & Assessment', ar: 'البشرة والاستشارة' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={packageFilter === tab.id}
                    onClick={() => setPackageFilter(tab.id)}
                    className={`tab text-xs font-semibold whitespace-nowrap ${
                      packageFilter === tab.id
                        ? 'tab-active bg-primary text-primary-content'
                        : 'text-primary/75'
                    }`}
                  >
                    {isAr ? tab.ar : tab.en}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPackages.map((pkg) => (
                <article
                  key={pkg.id}
                  className={`card rounded-3xl bg-white p-6 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1 ${
                    pkg.featured
                      ? 'border-2 border-secondary clinic-card-shadow'
                      : 'border border-base-300'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="text-xs font-semibold text-secondary">
                      {pkg.kicker[lang]}
                    </div>

                    <div>
                      <h3 className="font-display text-xl font-semibold text-primary leading-snug">
                        {pkg.title[lang]}
                      </h3>
                      <div className="mt-1.5 flex items-center gap-2 text-xs text-base-content/65">
                        <span className="tabular-nums">{pkg.duration[lang]}</span>
                        <span aria-hidden="true">·</span>
                        <span>{pkg.priceRange[lang]}</span>
                      </div>
                    </div>

                    <p className="text-sm text-base-content/75 leading-relaxed">
                      {pkg.description[lang]}
                    </p>

                    <ul className="space-y-2 pt-1 text-xs sm:text-sm text-base-content/85">
                      {pkg.highlights[lang].map((line) => (
                        <li key={line} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-5 border-t border-base-200 flex flex-col gap-2">
                    <a
                      href={buildWhatsAppUrl(pkg.whatsappMessage[lang])}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`btn btn-sm h-11 rounded-full font-semibold ${
                        pkg.featured
                          ? 'btn-accent text-white whatsapp-shadow'
                          : 'bg-base-200 border-base-300 text-primary hover:bg-accent hover:border-accent hover:text-white'
                      }`}
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>{pkg.ctaLabel[lang]}</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {/* ============================================================
                SECTION 02 — SPECIALISTS SPOTLIGHT (DANA, QAMAR, DUAA)
               ============================================================ */}
            <div
              id="specialists"
              className="mt-14 rounded-3xl border brass-hairline bg-white p-6 sm:p-8 lg:p-10 clinic-card-shadow"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 space-y-3">
                  <p className="text-xs font-semibold tracking-wider text-secondary">
                    {copy.specialistsKicker}
                  </p>
                  <h2 className="font-display text-3xl font-semibold text-primary leading-tight">
                    {copy.specialistsTitle}
                  </h2>
                  <p className="text-sm text-base-content/75 leading-relaxed">
                    {copy.specialistsSub}
                  </p>
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {SPECIALISTS.map((sp) => (
                    <div
                      key={sp.id}
                      className="rounded-2xl border border-base-300 bg-base-100 p-5 flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl font-display text-lg font-bold shrink-0 ${sp.accentClass}`}
                          >
                            {sp.initials[lang]}
                          </div>
                          <div>
                            <h3 className="font-display text-lg font-semibold text-primary leading-tight">
                              {sp.name[lang]}
                            </h3>
                            <p className="text-xs font-medium text-secondary">{sp.role[lang]}</p>
                          </div>
                        </div>

                        <p className="text-xs font-semibold text-primary/80">
                          {sp.specialty[lang]}
                        </p>
                        <p className="text-xs text-base-content/75 leading-relaxed">
                          {sp.bio[lang]}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-base-300/80 flex flex-col gap-2">
                        <span className="text-[11px] font-semibold text-secondary">
                          {sp.credential[lang]}
                        </span>
                        <a
                          href={buildWhatsAppUrl(
                            isAr
                              ? `مرحباً جراند كلينك طبربور، أود حجز موعد مع الأخصائية ${sp.name.ar}.`
                              : `Hello Grande Clinic Tabarbour, I would like to book an appointment with specialist ${sp.name.en}.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-xs btn-outline border-primary/25 text-primary hover:bg-accent hover:border-accent hover:text-white rounded-full"
                        >
                          <MessageCircle className="h-3 w-3" />
                          <span>{isAr ? `حجز مع ${sp.name.ar}` : `Book with ${sp.name.en}`}</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 03 — GEMINI AI SKIN PROTOCOL ADVISOR & CONCIERGE
           ============================================================ */}
        <AiSkinAdvisor lang={lang} />

        {/* ============================================================
            SECTION 04 — VERIFIED SOCIAL PROOF & CLINICAL STANDARDS
           ============================================================ */}
        <section id="reviews" className="w-full py-16 lg:py-20 bg-base-200 border-y border-base-300">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl space-y-2">
                <p className="text-xs font-semibold tracking-wider text-secondary">
                  {copy.reviewsKicker}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary text-balance">
                  {copy.reviewsTitle}
                </h2>
                <p className="text-sm sm:text-base text-base-content/75">{copy.reviewsSub}</p>
              </div>

              <a
                href={CLINIC_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-2xl border border-base-300 bg-white px-5 py-3.5 self-start md:self-auto transition-colors hover:border-secondary"
                aria-label={
                  isAr
                    ? 'عرض تقييمات جراند كلينك طبربور على ملف الأعمال في Google'
                    : 'View Grande Clinic Tabarbour reviews on Google Business Profile'
                }
              >
                <div>
                  <div className="flex items-center gap-0.5 text-secondary" aria-label="4.5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 4 ? 'fill-secondary' : 'fill-secondary/50'}`}
                      />
                    ))}
                  </div>
                  <div className="font-display text-lg font-bold text-primary tabular-nums mt-0.5">
                    {isAr ? '٤.٥ من ٥.٠' : '4.5 out of 5.0'}
                  </div>
                </div>
                <div className="h-9 w-px bg-base-300" aria-hidden="true" />
                <div className="text-xs">
                  <div className="font-semibold text-primary">Google Business Profile</div>
                  <div className="text-base-content/65">
                    {isAr ? '+١,٢٠٠ تقييم موثق على الخرائط' : '1,200+ Verified Google Reviews'}
                  </div>
                </div>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PATIENT_REVIEWS.map((review) => (
                <blockquote
                  key={review.id}
                  className="rounded-3xl border border-base-300 bg-white p-6 flex flex-col justify-between gap-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-base-content/60">
                      <div className="flex items-center gap-0.5 text-secondary">
                        {Array.from({ length: review.rating }).map((_, idx) => (
                          <Star key={idx} className="h-3.5 w-3.5 fill-secondary" />
                        ))}
                      </div>
                      <span>{review.timeAgo[lang]}</span>
                    </div>
                    <p className="text-sm text-base-content/85 leading-relaxed">
                      “{review.quote[lang]}”
                    </p>
                  </div>

                  <footer className="flex items-center gap-3 pt-4 border-t border-base-200">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-base-200 font-display text-sm font-bold text-primary">
                      {review.initial[lang]}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-primary">
                        {review.author[lang]}
                      </div>
                      <div className="text-xs text-base-content/65">
                        {review.treatment[lang]}
                      </div>
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>

            {/* 3 Clinical Standard Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {[
                { icon: Clock, item: copy.pillars[0] },
                { icon: ShieldCheck, item: copy.pillars[1] },
                { icon: CreditCard, item: copy.pillars[2] },
              ].map(({ icon: Icon, item }) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-base-300 bg-base-100 p-6 flex items-start gap-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-base-300 text-secondary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display text-lg font-semibold text-primary">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-base-content/75 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================
            SECTION 05 — LOCATION & DIRECTIONS (TAREK ST., TABARBOUR)
           ============================================================ */}
        <section id="location-directions" className="w-full py-16 lg:py-20 bg-base-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 space-y-10">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-semibold tracking-wider text-secondary">
                {copy.locationKicker}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary">
                {copy.locationTitle}
              </h2>
              <p className="text-sm sm:text-base text-base-content/75">{copy.locationSub}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-5 rounded-3xl border brass-hairline bg-white p-6 sm:p-8 flex flex-col justify-between gap-6 clinic-card-shadow">
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-base-200 text-secondary">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-primary">
                        {isAr ? 'جراند كلينك - طبربور' : 'Grande Clinic Tabarbour'}
                      </h3>
                      <p className="text-xs font-semibold text-secondary tabular-nums" dir="ltr">
                        Plus Code: {CLINIC_PLUS_CODE}, Amman
                      </p>
                    </div>
                  </div>

                    <address className="not-italic">
                      <dl className="space-y-4 text-sm">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 text-secondary shrink-0 mt-1" />
                          <div>
                            <dt className="font-semibold text-primary">{copy.addressLabel}</dt>
                            <dd className="text-base-content/75">{copy.addressValue}</dd>
                            <dd className="text-[11px] text-base-content/55 tabular-nums mt-0.5">
                              <span dir="ltr" className="inline-block">
                                GPS: {CLINIC_LAT.toFixed(6)}, {CLINIC_LNG.toFixed(6)}
                              </span>
                            </dd>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Car className="h-4 w-4 text-secondary shrink-0 mt-1" />
                          <div>
                            <dt className="font-semibold text-primary">{copy.parkingLabel}</dt>
                            <dd className="text-base-content/75">{copy.parkingValue}</dd>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Clock className="h-4 w-4 text-secondary shrink-0 mt-1" />
                          <div>
                            <dt className="font-semibold text-primary">{copy.hoursLabel}</dt>
                            <dd className="text-base-content/75">{copy.hoursValue}</dd>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Phone className="h-4 w-4 text-secondary shrink-0 mt-1" />
                          <div>
                            <dt className="font-semibold text-primary">{copy.deskLabel}</dt>
                            <dd>
                              <a
                                href={CLINIC_PHONE_TEL}
                                dir="ltr"
                                className="font-semibold text-primary hover:text-secondary tabular-nums"
                              >
                                {CLINIC_PHONE_DISPLAY}
                              </a>
                            </dd>
                          </div>
                        </div>
                      </dl>
                    </address>
                </div>

                <div className="flex flex-col gap-2.5 pt-4 border-t border-base-200">
                  <a
                    href={CLINIC_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary rounded-full text-primary-content font-semibold"
                  >
                    <MapPin className="h-4 w-4 text-secondary" />
                    <span>{copy.openMaps}</span>
                  </a>
                  <a
                    href={locationPinWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline border-base-300 rounded-full text-primary font-semibold hover:bg-accent hover:border-accent hover:text-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{copy.sendPinWa}</span>
                  </a>
                </div>
              </div>

              {/* Right Verified Google Business Profile Interactive Map */}
              <div className="lg:col-span-7 flex flex-col overflow-hidden rounded-3xl border border-base-300 bg-white clinic-card-shadow">
                <div className="relative flex-1 min-h-[320px] sm:min-h-[380px] w-full bg-base-200">
                  <iframe
                    title={
                      isAr
                        ? 'موقع جراند كلينك طبربور على خرائط Google'
                        : 'Grande Clinic Tabarbour Verified Google Maps Location'
                    }
                    src={CLINIC_MAPS_EMBED_URL}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    className="h-full w-full min-h-[320px] sm:min-h-[380px] border-0"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-base-300 bg-base-100 p-5">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>
                        {isAr ? 'ملف أعمال Google الموثق · طبربور' : 'Verified Google Business Profile'}
                      </span>
                    </div>
                    <div className="font-display text-lg font-semibold text-primary">
                      {isAr ? 'شارع طارق · مواقف خاصة مجانية' : 'Tarek Street · Dedicated Patient Parking'}
                    </div>
                    <p className="text-xs text-base-content/70">
                      {isAr
                        ? 'مفتوح يومياً ٨:٠٠ ص – ٧:٠٠ م · الإحداثيات الدقيقة 32.0030° N, 35.9375° E'
                        : 'Open daily 8:00 AM – 7:00 PM · Exact pin 32.0030° N, 35.9375° E'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <a
                      href={CLINIC_MAPS_DIRECTIONS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm h-10 rounded-full px-5 text-secondary-content font-semibold"
                    >
                      {isAr ? 'الاتجاهات الآن' : 'Get Directions'}
                    </a>
                    <a
                      href={CLINIC_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost btn-sm h-10 rounded-full px-4 text-primary font-semibold"
                    >
                      {isAr ? 'عرض على Google' : 'View Profile'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            BOTTOM FULL-BLEED CONVERSION BANNER
           ============================================================ */}
        <section className="w-full bg-primary py-16 lg:py-20 text-primary-content">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center space-y-6">
            <p className="text-xs font-semibold tracking-wider text-[#ffdea5]">
              {isAr
                ? 'حجوزات نفس اليوم متاحة · استشارة وفحص ميلانين مجاني'
                : 'Same-Day WhatsApp Slots Available · Complimentary Patch Test'}
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-semibold leading-tight text-balance">
              {copy.bannerTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-base text-white/80 leading-relaxed">
              {copy.bannerSub}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={primaryWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent btn-lg rounded-full px-8 text-white font-semibold whatsapp-shadow w-full sm:w-auto"
              >
                <MessageCircle className="h-5 w-5" />
                <span>{copy.ctaWhatsApp}</span>
              </a>
              <a
                href={CLINIC_PHONE_TEL}
                className="btn btn-outline border-white/30 btn-lg rounded-full px-8 text-white font-semibold hover:bg-white/10 hover:border-white/50 w-full sm:w-auto"
              >
                <Phone className="h-4 w-4 text-[#ffdea5]" />
                <span dir="ltr" className="tabular-nums">
                  {CLINIC_PHONE_DISPLAY}
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================
          QUIET CLINICAL FOOTER
         ============================================================ */}
      <footer className="w-full border-t border-base-300 bg-base-200 pt-12 pb-24 md:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-base-300">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border brass-hairline bg-white shrink-0">
                <img
                  src={CLINIC_IMAGES.logo}
                  alt="Grande Clinic Tabarbour"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-contain [transform:scale(4.6)_translateX(37%)]"
                />
              </span>
              <div>
                <div className="font-display text-lg font-semibold text-primary">
                  {copy.brandName}
                </div>
                <div className="text-xs text-base-content/70">
                  {isAr
                    ? 'شارع طارق، طبربور، عمّان · 2W3P+6X9'
                    : 'Tarek Street, Tabarbour, Amman · 2W3P+6X9'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-base-content/75">
              <a href="#laser-packages" className="hover:text-primary">
                {copy.nav.services}
              </a>
              <a href="#ai-advisor" className="hover:text-primary">
                {copy.nav.aiAdvisor}
              </a>
              <a href="#specialists" className="hover:text-primary">
                {copy.nav.specialists}
              </a>
              <a href="#reviews" className="hover:text-primary">
                {copy.nav.reviews}
              </a>
              <a href="#location-directions" className="hover:text-primary">
                {copy.nav.location}
              </a>
              <a href={CLINIC_PHONE_TEL} dir="ltr" className="font-semibold text-primary tabular-nums">
                {CLINIC_PHONE_DISPLAY}
              </a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-base-content/65">
            <p>{copy.footerLegal}</p>
            <p>
              {isAr
                ? 'طرق الدفع: فيزا · ماستركارد · بطاقات الصراف الأردنية · نقداً'
                : 'Accepted: Visa · MasterCard · Jordanian Debit · Cash'}
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Compact Bottom Action Dock (keeps total sticky height <= 15% of 844px) */}
      <aside className="fixed bottom-3 inset-x-3 z-40 md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-2 rounded-full border brass-hairline bg-primary p-1.5 shadow-xl">
          <a
            href={CLINIC_PHONE_TEL}
            className="btn btn-sm flex-1 rounded-full border-none bg-base-100 text-primary font-semibold"
          >
            <Phone className="h-3.5 w-3.5 text-secondary" />
            <span>{isAr ? 'اتصال' : 'Call'}</span>
          </a>
          <a
            href={primaryWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-accent flex-[1.3] rounded-full border-none text-white font-semibold"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
          </a>
        </div>
      </aside>
    </div>
  );
}

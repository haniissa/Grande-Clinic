import type { Language, ServiceId, SpecialistId } from '../utils/clinicLogic';

export interface ServicePackageItem {
  id: ServiceId;
  featured?: boolean;
  kicker: Record<Language, string>;
  title: Record<Language, string>;
  duration: Record<Language, string>;
  priceRange: Record<Language, string>;
  description: Record<Language, string>;
  highlights: Record<Language, string[]>;
  ctaLabel: Record<Language, string>;
  whatsappMessage: Record<Language, string>;
}

export interface SpecialistProfile {
  id: SpecialistId;
  initials: Record<Language, string>;
  name: Record<Language, string>;
  role: Record<Language, string>;
  specialty: Record<Language, string>;
  bio: Record<Language, string>;
  credential: Record<Language, string>;
  accentClass: string;
}

export interface PatientReview {
  id: string;
  author: Record<Language, string>;
  initial: Record<Language, string>;
  treatment: Record<Language, string>;
  timeAgo: Record<Language, string>;
  quote: Record<Language, string>;
  specialistMention: SpecialistId;
  rating: number;
}

export const CLINIC_IMAGES = {
  logo: '/assets/aistudio/screen_84ba6e2b.png',
  laserSession: '/assets/aistudio/screen_a697db63.png',
  luxurySuite: '/assets/aistudio/screen_51823e9e.png',
} as const;

export const SERVICE_PACKAGES: ServicePackageItem[] = [
  {
    id: 'full-body',
    featured: true,
    kicker: { en: 'Comprehensive Care · Most Requested', ar: 'عناية متكاملة · الأكثر طلباً' },
    title: { en: 'Full-Body Laser Hair Removal', ar: 'باقة الجسم الكامل بالليزر' },
    duration: { en: '60 – 75 min', ar: '٦٠ – ٧٥ دقيقة' },
    priceRange: { en: 'Custom Multi-Session Plan', ar: 'خطط جلسات متعددة مخصصة' },
    description: {
      en: 'Full body including belly and back with continuous sub-zero contact cooling for uninterrupted comfort across all skin tones.',
      ar: 'إزالة شاملة لشعر الجسم متضمنة البطن والظهر، مدعمة بتقنية التبريد التلامسي تحت الصفر لراحة مطلقة وانعدام للألم.',
    },
    highlights: {
      en: [
        'Sub-zero dynamic contact cooling (-4°C)',
        'Calibrated for Fitzpatrick phototypes I–VI',
        'Pre-session clinical consultation included',
      ],
      ar: [
        'تبريد تلامسي فوري ملطف ومقاوم للألم (-٤°م)',
        'آمن ومعاير لجميع درجات وأنماط البشرة',
        'استشارة طبية وفحص بشرة قبل الجلسة',
      ],
    },
    ctaLabel: { en: 'Reserve Full-Body Session', ar: 'حجز جلسة الجسم الكامل' },
    whatsappMessage: {
      en: "Hi Grande Clinic Tabarbour, I'm interested in the Full-Body Laser Package. Please share available appointment slots.",
      ar: 'مرحباً جراند كلينك طبربور، أنا مهتمة بباقة الجسم الكامل بالليزر. يرجى تزويدي بالمواعيد المتاحة.',
    },
  },
  {
    id: 'facial-rejuvenation',
    kicker: { en: 'Derma Glow · Clinical Facial', ar: 'نضارة البشرة · عناية طبية' },
    title: { en: 'Facial & Skin Rejuvenation', ar: 'نضارة وتجديد البشرة' },
    duration: { en: '45 – 60 min', ar: '٤٥ – ٦٠ دقيقة' },
    priceRange: { en: 'Single or 3-Session Protocol', ar: 'جلسة مفردة أو برنامج ٣ جلسات' },
    description: {
      en: 'HydraFacial Glow Elite, Carbon Laser Hollywood Peel, and collagen-inducing microneedling for luminous tone clarity.',
      ar: 'هيدرافيشل إيليت الطبي، التقشير الكربوني (هوليوود بيل)، وجلسات المايكرونيدلينغ لتحفيز الكولاجين وتوحيد اللون.',
    },
    highlights: {
      en: [
        'Deep thermal pore extraction & hydration',
        'Targeted pigment & texture rebalancing',
        'Zero downtime for immediate event radiance',
      ],
      ar: [
        'تنظيف عميق وتفريغ للمسامات وترطيب طبي',
        'تحفيز طبيعي لألياف الكولاجين وتوحيد اللون',
        'إشراقة ونضارة فورية بدون فترة نقاهة',
      ],
    },
    ctaLabel: { en: 'Reserve Facial Protocol', ar: 'حجز جلسة نضارة البشرة' },
    whatsappMessage: {
      en: "Hi Grande Clinic Tabarbour, I'd like to book a Facial & Skin Rejuvenation session.",
      ar: 'مرحباً جراند كلينك طبربور، أود الاستفسار وحجز جلسة نضارة وتجديد البشرة.',
    },
  },
  {
    id: 'targeted-laser',
    kicker: { en: 'Precision Zones · Express', ar: 'مناطق محددة · جلسة سريعة' },
    title: { en: 'Targeted Laser Sessions', ar: 'جلسات المناطق المحددة' },
    duration: { en: '15 – 30 min', ar: '١٥ – ٣٠ دقيقة' },
    priceRange: { en: 'Per-Zone Transparent Rate', ar: 'تسعير واضح حسب المنطقة' },
    description: {
      en: 'Rapid high-accuracy laser coverage for underarms, arms, legs, bikini line, or men’s razor-free beard line contouring.',
      ar: 'جلسات سريعة فائقة الدقة لمنطقة الإبطين، الذراعين، الساقين، البكيني، أو تحديد خط اللحية بدقة للرجال.',
    },
    highlights: {
      en: [
        'Punctual 15–30 minute express turnaround',
        'Autoclaved tips & single-use consumables',
        'Immediate return to daily Amman schedule',
      ],
      ar: [
        'مدة الجلسة ١٥ – ٣٠ دقيقة فقط بدون انتظار',
        'رؤوس معقمة بالأوتوكلاف وأدوات وحيدة الاستعمال',
        'بدون احمرار أو فترات نقاهة بعد الجلسة',
      ],
    },
    ctaLabel: { en: 'Reserve Targeted Zone', ar: 'حجز منطقة محددة' },
    whatsappMessage: {
      en: 'Hi Grande Clinic Tabarbour, I want to book a Targeted Laser Session.',
      ar: 'مرحباً جراند كلينك طبربور، أرغب بحجز جلسة ليزر لمنطقة محددة.',
    },
  },
  {
    id: 'free-assessment',
    kicker: { en: 'New Patients · Complimentary', ar: 'للمراجعين الجدد · مجاناً' },
    title: { en: 'Complimentary Skin Assessment', ar: 'استشارة وفحص بشرة مجاني' },
    duration: { en: '20 min', ar: '٢٠ دقيقة' },
    priceRange: { en: '0 JOD · No Obligation', ar: 'مجاني بالكامل · بدون التزام' },
    description: {
      en: 'Comprehensive melanin scan, follicle density evaluation, and complimentary laser patch test with our licensed specialists.',
      ar: 'تقييم كامل لنوع البشرة وكثافة بصيلات الشعر، وتجربة نبضة الليزر (Patch Test) مجاناً وبدون أي التزام مسبق.',
    },
    highlights: {
      en: [
        'Objective Fitzpatrick melanin index check',
        'Conducted by Dana, Qamar, or Duaa',
        'Written custom wavelength & session roadmap',
      ],
      ar: [
        'فحص الميلانين وتجربة نبضة ليزر مجانية',
        'بإشراف الأخصائية دانا أو قمر أو دعاء',
        'خطة علاجية واضحة ومخصصة لبشرتكِ',
      ],
    },
    ctaLabel: { en: 'Claim Free Assessment', ar: 'طلب الاستشارة المجانية' },
    whatsappMessage: {
      en: "Hi Grande Clinic Tabarbour, I'd like to claim my complimentary Skin Assessment and Patch Test.",
      ar: 'مرحباً جراند كلينك طبربور، أود حجز الاستشارة وفحص البشرة المجاني مع تجربة النبضة.',
    },
  },
];

export const SPECIALISTS: SpecialistProfile[] = [
  {
    id: 'dana',
    initials: { en: 'DN', ar: 'د' },
    name: { en: 'Dana', ar: 'دانا' },
    role: { en: 'Senior Laser Specialist', ar: 'أخصائية ليزر أولى' },
    specialty: { en: 'Sensitive & Delicate Zones', ar: 'البشرة الحساسة والمناطق الدقيقة' },
    bio: {
      en: 'Celebrated across Tabarbour for her calm, gentle touch and meticulous calibration on sensitive skin and first-time laser patients.',
      ar: 'تتميز بلمستها الرقيقة وخبرتها الدقيقة في التعامل مع البشرة الحساسة والمناطق الدقيقة والمراجعات لأول مرة بأعلى راحة.',
    },
    credential: { en: 'Top Patient Comfort Rating', ar: 'أعلى معدل رضا للمراجعات' },
    accentClass: 'bg-primary text-primary-content',
  },
  {
    id: 'qamar',
    initials: { en: 'QM', ar: 'ق' },
    name: { en: 'Qamar', ar: 'قمر' },
    role: { en: 'Laser & Skin Specialist', ar: 'أخصائية ليزر وبشرة' },
    specialty: { en: 'Full-Body Laser & HydraFacial', ar: 'ليزر الجسم الكامل والهيدرافيشل' },
    bio: {
      en: 'Specialized in uniform full-body laser passes, deep pore clinical extraction, and post-laser calming skincare protocols.',
      ar: 'متخصصة في النبضات المتتالية للجسم الكامل، تنظيف المسام العميق، وبروتوكولات النضارة الفورية بعد الليزر.',
    },
    credential: { en: 'MoH Certified Precision Tech', ar: 'مرخصة من وزارة الصحة الأردنية' },
    accentClass: 'bg-secondary text-secondary-content',
  },
  {
    id: 'duaa',
    initials: { en: 'DU', ar: 'ع' },
    name: { en: 'Duaa', ar: 'دعاء' },
    role: { en: 'Aesthetic & Safety Lead', ar: 'مسؤولة بروتوكولات السلامة' },
    specialty: { en: 'Phototype Calibration & Patch Tests', ar: 'معايرة الميلانين وبروتوكولات الأمان' },
    bio: {
      en: 'Dedicated to clinical phototype evaluation, cryogenic cooling calibration, and hospital-grade sterilization oversight.',
      ar: 'خبيرة في تحديد درجات الميلانين ومعايرة طاقة التبريد والإشراف على معايير التعقيم الطبي بمستوى المستشفيات.',
    },
    credential: { en: 'Clinical Sterilization Lead', ar: 'إشراف معايير السلامة والتعقيم' },
    accentClass: 'bg-[#2c463e] text-white',
  },
];

export const PATIENT_REVIEWS: PatientReview[] = [
  {
    id: 'rev-1',
    author: { en: 'Rania Al-Majali', ar: 'رانيا المجالي' },
    initial: { en: 'R', ar: 'ر' },
    treatment: { en: 'Full-Body Laser Patient', ar: 'مراجعة جلسات ليزر كامل الجسم' },
    timeAgo: { en: '2 weeks ago', ar: 'قبل أسبوعين' },
    quote: {
      en: 'I was very nervous about laser pain, but specialist Dana was remarkably gentle and walked me through every setting. The sub-zero cooling made it virtually painless—our Tabarbour clinic is now my permanent choice.',
      ar: 'كنت مترددة وخايفة جداً من ألم الليزر، لكن الأخصائية دانا كانت لطيفة ومريحة وشرحتلي كل خطوة. جهاز التبريد عندهم عجيب وما حسيت بأي وجع يذكر. عيادة طبربور صارت خياري الدائم!',
    },
    specialistMention: 'dana',
    rating: 5,
  },
  {
    id: 'rev-2',
    author: { en: 'Tariq Haddad', ar: 'طارق حداد' },
    initial: { en: 'T', ar: 'ط' },
    treatment: { en: 'Beard Contour & Skin Care', ar: 'تحديد خط اللحية وعناية بالبشرة' },
    timeAgo: { en: '1 month ago', ar: 'قبل شهر' },
    quote: {
      en: 'The zero-wait policy is 100% real. I booked my slot via WhatsApp, arrived at 10:00 AM, and specialist Qamar was ready in a spotless, sterilized suite. True medical discipline.',
      ar: 'الالتزام بالموعد عندهم حقيقي ١٠٠٪. حجزت على الواتساب ووصلت الساعة ١٠ صباحاً وكانت الأخصائية قمر بانتظاري في غرفة معقمة ومجهزة بالكامل. مستوى النظافة والاحترافية يرفع الرأس.',
    },
    specialistMention: 'qamar',
    rating: 5,
  },
  {
    id: 'rev-3',
    author: { en: 'Noor Al-Khatib', ar: 'نور الخطيب' },
    initial: { en: 'N', ar: 'ن' },
    treatment: { en: 'HydraFacial & Laser Patient', ar: 'مراجعة هيدرافيشل وليزر' },
    timeAgo: { en: '3 weeks ago', ar: 'قبل ٣ أسابيع' },
    quote: {
      en: 'Specialist Duaa performed a thorough patch test and explained my skin phototype before starting. Having this level of dermatological care on Tarek St. in Tabarbour saves driving across Amman.',
      ar: 'الأخصائية دعاء عملتلي فحص واختبار نبضة قبل البدء وشرحت المعايير بدقة. وجود عيادة بهذا الرقي الطبي في شارع طارق بطبربور وفّر علينا مشوار النزول لغرب عمّان.',
    },
    specialistMention: 'duaa',
    rating: 5,
  },
];

export const UI_COPY = {
  en: {
    brandName: 'Grande Clinic',
    nav: {
      services: 'Packages',
      aiAdvisor: 'Skin Advisor',
      specialists: 'Specialists',
      reviews: 'Reviews',
      location: 'Location',
    },
    headerCta: 'Book Appointment',
    langSwitch: 'العربية',
    heroKicker: 'Tarek St., Tabarbour, Amman · Rated 4.5 ★ (1,200+ Google Reviews) · Daily 8:00 AM – 7:00 PM',
    heroTitleLead: 'Amman’s Premier',
    heroTitleAccent: 'Laser & Aesthetic',
    heroTitleTail: 'Suite in Tabarbour',
    heroSubtitle:
      'Virtually painless medical-grade laser hair removal with sub-zero contact cooling and clinical skincare, led exclusively by MoH-licensed specialists Dana, Qamar, and Duaa. Private suites with zero waiting delays.',
    ctaWhatsApp: 'Book via WhatsApp',
    ctaDirectReserve: 'Schedule Online',
    ctaCall: 'Call 07 9919 1660',
    heroNote: 'Strict appointment-only policy · Instant WhatsApp desk confirmation · Private patient parking',
    photo1Title: 'Sub-Zero Cryo Cooling',
    photo1Sub: 'Pain-free contact tip across all phototypes',
    photo2Title: 'Tabarbour Private Suites',
    photo2Sub: 'Serene, sterilized clinical rooms on Tarek St.',
    stats: [
      { value: '4.5 / 5.0', label: '1,200+ Verified Google Maps Reviews' },
      { value: '0 min', label: 'Wait Time · Strict Appointment Policy' },
      { value: 'MoH', label: 'Ministry of Health Licensed Specialists' },
      { value: 'Flexible', label: 'Visa, MasterCard, Jordanian Debit & Cash' },
    ],
    servicesKicker: '01. Clinical Protocols',
    servicesTitle: 'Laser Packages & Aesthetic Sessions',
    servicesSub:
      'Every appointment begins with a melanin phototype check and continuous cryogenic cooling for clinical efficacy and comfort.',
    specialistsKicker: '02. Licensed Practitioners',
    specialistsTitle: 'Meet Your Tabarbour Specialists',
    specialistsSub:
      'All laser and facial protocols are delivered exclusively by Ministry of Health certified female practitioners.',
    aiKicker: '03. Smart Clinical Triage',
    aiTitle: 'AI Laser Protocol Advisor & Concierge',
    aiSub:
      'Match your Fitzpatrick skin phototype to the safest dual-wavelength laser protocol, get paired with Dana, Qamar, or Duaa, or ask our instant bilingual desk.',
    reviewsKicker: '04. Verified Local Proof',
    reviewsTitle: '1,200+ Patient Experiences in Amman',
    reviewsSub:
      'Authentic reviews from residents across Tabarbour and North Amman visiting our Tarek Street clinic.',
    pillars: [
      {
        title: 'Strict Appointment-Only Access',
        desc: 'No crowded reception rooms. Your private suite is prepared, cooled, and waiting precisely at your scheduled slot.',
      },
      {
        title: 'Hospital-Grade Autoclave Hygiene',
        desc: 'Sterilized laser handpieces, sealed single-use consumables, and full room sanitization between every visit.',
      },
      {
        title: 'Transparent On-Site Payments',
        desc: 'Visa, MasterCard, Jordanian debit cards, and cash accepted comfortably at reception after your consultation.',
      },
    ],
    locationKicker: '05. Tarek Street Sanctuary',
    locationTitle: 'Visit Grande Clinic Tabarbour',
    locationSub:
      'Quiet, discreet clinical access right off Tarek Street with dedicated shaded parking for patients.',
    addressLabel: 'Exact Address',
    addressValue: 'Tarek Street, Tabarbour, Amman, Jordan',
    parkingLabel: 'Landmark & Parking',
    parkingValue: 'Directly off the Tabarbour main corridor with dedicated patient parking.',
    hoursLabel: 'Operating Hours',
    hoursValue: 'Open 7 Days: 8:00 AM – 7:00 PM (Strict advance appointment required)',
    deskLabel: 'Direct Reception Desk',
    openMaps: 'Open in Google Maps',
    sendPinWa: 'Request Location Pin on WhatsApp',
    bannerTitle: 'Smooth, Radiant Skin Without Leaving Tabarbour',
    bannerSub:
      'Book your complimentary melanin scan and patch test today with specialists Dana, Qamar, or Duaa.',
    footerLegal: '© 2026 Grande Clinic Tabarbour · Tarek St., Amman · Licensed by the Jordan Ministry of Health',
    myBookings: 'Reservations',
  },
  ar: {
    brandName: 'جراند كلينك',
    nav: {
      services: 'الباقات',
      aiAdvisor: 'المستشار الذكي',
      specialists: 'الأخصائيات',
      reviews: 'التقييمات',
      location: 'الموقع',
    },
    headerCta: 'احجزي موعدكِ',
    langSwitch: 'English',
    heroKicker: 'شارع طارق، طبربور، عمّان · تقييم ٤.٥ ★ (+١,٢٠٠ تقييم) · يومياً ٨:٠٠ ص – ٧:٠٠ م',
    heroTitleLead: 'وجهتكِ الأولى لإزالة الشعر',
    heroTitleAccent: 'بالليزر والعناية بالبشرة',
    heroTitleTail: 'في طبربور - عمّان',
    heroSubtitle:
      'تجربة إزالة شعر بالليزر الطبي بدون ألم مع تقنية التبريد التلامسي تحت الصفر، وبروتوكولات عناية متقدمة بالبشرة تحت إشراف أخصائيات مرخصات من وزارة الصحة: دانا، قمر، ودعاء، بخصوصية تامة وصفر انتظار.',
    ctaWhatsApp: 'حجز فوري عبر واتساب',
    ctaDirectReserve: 'حجز موعد إلكتروني',
    ctaCall: 'اتصال: 07 9919 1660',
    heroNote: 'سياسة الحجز المسبق الإلزامي · تأكيد فوري عبر الواتساب · مواقف سيارات خاصة للمراجعين',
    photo1Title: 'تبريد تلامسي فائق بدون ألم',
    photo1Sub: 'آمن ومعاير لجميع درجات البشرة',
    photo2Title: 'أجنحة طبربور الخاصة',
    photo2Sub: 'غرف علاجية معقمة وهادئة في شارع طارق',
    stats: [
      { value: '٤.٥ / ٥.٠', label: 'أكثر من ١,٢٠٠ تقييم موثق على Google' },
      { value: '٠ دقيقة', label: 'انتظار · التزام ١٠٠٪ بالمواعيد المسبقة' },
      { value: 'مرخصة', label: 'كوادر طبية معتمدة من وزارة الصحة الأردنية' },
      { value: 'دفع ميسر', label: 'فيزا، ماستركارد، بطاقات الصراف، وكاش' },
    ],
    servicesKicker: '٠١. البروتوكولات الطبية',
    servicesTitle: 'باقات الليزر وجلسات العناية المتطورة بالبشرة',
    servicesSub:
      'تتضمن كل جلسة فحصاً دقيقاً لدرجة الميلانين ونوع البشرة مع تبريد تلامسي مستمر لضمان الراحة والأمان.',
    specialistsKicker: '٠٢. الفريق الطبي المرخص',
    specialistsTitle: 'نخبة أخصائيات طبربور',
    specialistsSub:
      'تُجرى جميع جلسات الليزر والعناية بالبشرة حصرياً على يد ممارسات مرخصات ومدرّبات على أحدث الأجهزة العالمية.',
    aiKicker: '٠٣. المستشار الذكي للبشرة والليزر',
    aiTitle: 'مخطط جلسات الليزر الذكي والاستقبال الفوري',
    aiSub:
      'حددي درجة بشرتكِ للحصول على الطول الموجي الأنسب والأخصائية المقترحة (دانا، قمر، أو دعاء)، أو اسألي مكتب الاستقبال الذكي.',
    reviewsKicker: '٠٤. تجارب موثقة من عمّان',
    reviewsTitle: 'أكثر من ١,٢٠٠ تجربة مراجع في طبربور',
    reviewsSub:
      'آراء حقيقية من أهالي طبربور وشمال عمّان الذين اختاروا عيادتنا في شارع طارق.',
    pillars: [
      {
        title: 'سياسة الحجز المسبق الإلزامي',
        desc: 'لا وجود للانتظار المزدحم. تحظى كل مراجعة بغرفة علاجية مخصصة ومعقمة قبل وصولها بدقة تامة.',
      },
      {
        title: 'تعقيم طبي بمستوى المستشفيات',
        desc: 'تعقيم حراري بالأوتوكلاف لرؤوس الأجهزة واستبدال كامل للأدوات وحيدة الاستعمال بين كل جلسة وأخرى.',
      },
      {
        title: 'وسائل دفع مرنة في العيادة',
        desc: 'نقبل بطاقات فيزا وماستركارد والبطاقات المصرفية الأردنية والدفع النقدي في مكتب الاستقبال.',
      },
    ],
    locationKicker: '٠٥. موقعنا في شارع طارق',
    locationTitle: 'زورينا في جراند كلينك طبربور',
    locationSub:
      'موقع استراتيجي هادئ على شارع طارق مع مواقف سيارات خاصة لراحة وخصوصية المراجعين.',
    addressLabel: 'العنوان الدقيق',
    addressValue: 'شارع طارق، طبربور، عمّان، المملكة الأردنية الهاشمية',
    parkingLabel: 'المعالم ومواقف السيارات',
    parkingValue: 'مباشرة بجانب شريان طبربور الرئيسي مع مواقف خاصة ومؤمنة للمراجعين.',
    hoursLabel: 'ساعات العمل',
    hoursValue: 'يومياً طيلة الأسبوع: ٨:٠٠ صباحاً – ٧:٠٠ مساءً (بالحجز المسبق)',
    deskLabel: 'مكتب الاستقبال المباشر',
    openMaps: 'فتح الموقع في خرائط Google',
    sendPinWa: 'إرسال الموقع عبر واتساب',
    bannerTitle: 'بشرة ناعمة ومشرقة مع خبيرات الليزر في طبربور',
    bannerSub:
      'احجزي استشارتكِ المجانية مع فحص الميلانين وتجربة النبضة اليوم بإشراف دانا، قمر، أو دعاء.',
    footerLegal: '© ٢٠٢٦ جراند كلينك طبربور · شارع طارق، عمّان · مرخصة أصولياً من وزارة الصحة الأردنية',
    myBookings: 'حجوزاتي',
  },
} as const;

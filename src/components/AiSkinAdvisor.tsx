import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  MessageCircle,
  Send,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import { SERVICE_PACKAGES, SPECIALISTS, UI_COPY } from '../data/clinicContent';
import {
  buildWhatsAppUrl,
  getRecommendedWavelength,
  type FitzpatrickType,
  type Language,
  type ServiceId,
  type SkinPlanResponse,
  type SpecialistId,
} from '../utils/clinicLogic';

interface AiSkinAdvisorProps {
  lang: Language;
  onReserveProtocol?: (serviceId: ServiceId, specialistId: SpecialistId, notes: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const FITZPATRICK_SCALE: Array<{
  type: FitzpatrickType;
  swatch: string;
  label: Record<Language, string>;
}> = [
  { type: 1, swatch: '#f6e1d3', label: { en: 'I · Very Fair', ar: '١ · فاتحة جداً' } },
  { type: 2, swatch: '#efd0b8', label: { en: 'II · Fair', ar: '٢ · فاتحة' } },
  { type: 3, swatch: '#dfb28c', label: { en: 'III · Medium', ar: '٣ · قمحية' } },
  { type: 4, swatch: '#c58f63', label: { en: 'IV · Olive', ar: '٤ · حنطية' } },
  { type: 5, swatch: '#98643e', label: { en: 'V · Tan/Brown', ar: '٥ · سمراء' } },
  { type: 6, swatch: '#5f3c26', label: { en: 'VI · Deep', ar: '٦ · داكنة' } },
];

const QUICK_QUESTIONS: Record<Language, string[]> = {
  en: [
    'Is full-body laser hair removal painful with cryo-cooling?',
    'Where is patient parking on Tarek Street in Tabarbour?',
    'How should I prepare 24 hours before my laser session?',
  ],
  ar: [
    'هل إزالة الشعر بالليزر مؤلمة مع جهاز التبريد؟',
    'أين تتوفر مواقف السيارات في شارع طارق بطبربور؟',
    'كيف أستعد قبل جلسة الليزر بـ ٢٤ ساعة؟',
  ],
};

export function AiSkinAdvisor({
  lang,
}: AiSkinAdvisorProps) {
  const isAr = lang === 'ar';
  const copy = UI_COPY[lang];

  const [activeTab, setActiveTab] = useState<'protocol' | 'concierge'>('protocol');

  // Protocol Matcher state
  const [fitzpatrick, setFitzpatrick] = useState<FitzpatrickType>(3);
  const [serviceId, setServiceId] = useState<ServiceId>('full-body');
  const [sensitivity, setSensitivity] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [targetArea, setTargetArea] = useState('');
  const [notes, setNotes] = useState('');
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [plan, setPlan] = useState<SkinPlanResponse | null>(null);

  // Bilingual Concierge Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const baselineWave = getRecommendedWavelength(fitzpatrick);

  const handleGeneratePlan = async (e: FormEvent) => {
    e.preventDefault();
    setPlanError(null);
    setPlanLoading(true);

    try {
      const res = await fetch('/api/ai/skin-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang,
          fitzpatrick,
          serviceId,
          sensitivity,
          targetArea:
            targetArea.trim() ||
            (serviceId === 'full-body'
              ? isAr
                ? 'الجسم الكامل'
                : 'Full body'
              : isAr
                ? 'الوجه أو منطقة محددة'
                : 'Facial / targeted zone'),
          notes: notes.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPlanError(
          data.error ||
            (isAr ? 'تعذر إنشاء خطة الليزر حالياً.' : 'Unable to generate protocol right now.')
        );
        return;
      }

      const generated = data.plan as SkinPlanResponse;
      setPlan(generated);
    } catch {
      setPlanError(
        isAr
          ? 'حدث خطأ في الاتصال بالخادم أثناء تحليل ملف البشرة.'
          : 'Network error while reaching the clinical advisor.'
      );
    } finally {
      setPlanLoading(false);
    }
  };

  const sendConciergeMessage = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || chatLoading) return;

    setChatError(null);
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lang,
          message: trimmed,
          history: nextHistory.map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setChatError(
          data.error ||
            (isAr ? 'تعذر الحصول على رد من مكتب الاستقبال.' : 'Unable to reach concierge desk.')
        );
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: String(data.reply),
        },
      ]);
    } catch {
      setChatError(
        isAr
          ? 'حدث خطأ في الاتصال بالخادم. يمكنكِ التواصل معنا مباشرة عبر واتساب.'
          : 'Connection error reaching concierge. You can also message us directly on WhatsApp.'
      );
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendConciergeMessage(chatInput);
  };

  return (
    <section id="ai-advisor" className="w-full py-16 lg:py-20 bg-base-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-semibold tracking-wider text-secondary">{copy.aiKicker}</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary text-balance">
              {copy.aiTitle}
            </h2>
            <p className="text-sm sm:text-base text-base-content/75 leading-relaxed">
              {copy.aiSub}
            </p>
          </div>

          {/* DaisyUI Interactive Segmented Tabs */}
          <div
            role="tablist"
            aria-label={isAr ? 'أدوات الاستشارة الذكية' : 'Smart consultation tools'}
            className="tabs tabs-box bg-base-200 p-1.5 border border-base-300 self-start md:self-auto"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'protocol'}
              onClick={() => setActiveTab('protocol')}
              className={`tab gap-1.5 text-xs sm:text-sm font-semibold whitespace-nowrap ${
                activeTab === 'protocol'
                  ? 'tab-active bg-primary text-primary-content'
                  : 'text-primary/75'
              }`}
            >
              <Stethoscope className="h-4 w-4" />
              <span>{isAr ? 'مخطط جلسة الليزر' : 'Laser Protocol Matcher'}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'concierge'}
              onClick={() => setActiveTab('concierge')}
              className={`tab gap-1.5 text-xs sm:text-sm font-semibold whitespace-nowrap ${
                activeTab === 'concierge'
                  ? 'tab-active bg-primary text-primary-content'
                  : 'text-primary/75'
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{isAr ? 'اسألي الاستقبال الذكي' : 'Clinic Concierge Q&A'}</span>
            </button>
          </div>
        </div>

        {activeTab === 'protocol' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Form Column (6 cols) */}
            <form
              onSubmit={handleGeneratePlan}
              className="lg:col-span-6 rounded-3xl border brass-hairline bg-white p-6 sm:p-8 clinic-card-shadow flex flex-col justify-between gap-6"
            >
              <div className="space-y-6">
                {/* Fitzpatrick Swatch Selector */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <label className="text-sm font-semibold text-primary">
                      {isAr ? '١. اختاري درجة بشرتكِ (مقياس فيتزباتريك)' : '1. Select Your Fitzpatrick Skin Phototype'}
                    </label>
                    <span className="text-xs font-medium text-secondary tabular-nums">
                      {baselineWave.wavelengthNm}nm · {baselineWave.coolingTempC}°C
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {FITZPATRICK_SCALE.map((item) => {
                      const active = fitzpatrick === item.type;
                      return (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => setFitzpatrick(item.type)}
                          className={`flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-start transition-colors ${
                            active
                              ? 'border-primary bg-primary text-primary-content'
                              : 'border-base-300 bg-base-100 text-primary hover:border-secondary'
                          }`}
                        >
                          <span
                            className="h-5 w-5 rounded-full border border-black/15 shrink-0"
                            style={{ backgroundColor: item.swatch }}
                          />
                          <span className="text-xs font-medium truncate">{item.label[lang]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Treatment Goal & Sensitivity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label htmlFor="advisor-service" className="label pb-1">
                      <span className="label-text text-xs font-semibold text-primary">
                        {isAr ? '٢. الهدف العلاجي' : '2. Primary Treatment Goal'}
                      </span>
                    </label>
                    <select
                      id="advisor-service"
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value as ServiceId)}
                      className="select select-bordered w-full bg-base-200/70 border-base-300 focus:border-secondary text-sm"
                    >
                      {SERVICE_PACKAGES.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.title[lang]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-primary mb-2">
                      {isAr ? '٣. حساسية البشرة' : '3. Skin Sensitivity'}
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(
                        [
                          { id: 'low', en: 'Low', ar: 'منخفضة' },
                          { id: 'moderate', en: 'Medium', ar: 'متوسطة' },
                          { id: 'high', en: 'High', ar: 'حساسة' },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSensitivity(opt.id)}
                          className={`btn btn-sm rounded-xl border ${
                            sensitivity === opt.id
                              ? 'btn-primary text-primary-content'
                              : 'bg-base-200/70 border-base-300 text-primary hover:border-secondary'
                          }`}
                        >
                          {isAr ? opt.ar : opt.en}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Focus area & optional notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label htmlFor="advisor-area" className="label pb-1">
                      <span className="label-text text-xs font-semibold text-primary">
                        {isAr ? 'المنطقة المستهدفة (اختياري)' : 'Target Area (Optional)'}
                      </span>
                    </label>
                    <input
                      id="advisor-area"
                      type="text"
                      value={targetArea}
                      onChange={(e) => setTargetArea(e.target.value)}
                      placeholder={
                        isAr ? 'مثل: الجسم الكامل، الوجه، الإبطين' : 'e.g., Full body, face, underarms'
                      }
                      className="input input-bordered w-full bg-base-200/70 border-base-300 focus:border-secondary text-sm"
                    />
                  </div>

                  <div className="form-control">
                    <label htmlFor="advisor-notes" className="label pb-1">
                      <span className="label-text text-xs font-semibold text-primary">
                        {isAr ? 'تجربة سابقة أو ملاحظات' : 'Prior Laser History / Notes'}
                      </span>
                    </label>
                    <input
                      id="advisor-notes"
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={
                        isAr ? 'مثل: أول مرة، تان خفيف...' : 'e.g., First timer, mild sun tan...'
                      }
                      className="input input-bordered w-full bg-base-200/70 border-base-300 focus:border-secondary text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-base-300">
                <span className="text-xs text-base-content/65">
                  {isAr
                    ? 'يتضمن ترشيح الأخصائية المناسبة وفحص البشرة المجاني بالعيادة'
                    : 'Includes specialist matching & complimentary in-clinic patch test'}
                </span>
                <button
                  type="submit"
                  disabled={planLoading}
                  className="btn btn-primary rounded-full px-6 text-primary-content font-semibold"
                >
                  {planLoading ? (
                    <span className="loading loading-spinner loading-xs" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-secondary" />
                  )}
                  <span>
                    {planLoading
                      ? isAr
                        ? 'جارٍ إعداد خطتكِ...'
                        : 'Building Protocol...'
                      : isAr
                        ? 'إنشاء خطة الليزر بالذكاء الاصطناعي'
                        : 'Generate Custom Protocol'}
                  </span>
                </button>
              </div>
            </form>

            {/* Right Results Dossier Column (6 cols) */}
            <div className="lg:col-span-6 rounded-3xl border border-base-300 bg-base-200/70 p-6 sm:p-8 flex flex-col justify-between gap-6">
              {planError ? (
                <div role="alert" className="alert alert-error rounded-2xl">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span className="text-sm">{planError}</span>
                </div>
              ) : plan ? (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-base-300 pb-4">
                    <div>
                      <p className="text-xs font-semibold text-secondary">
                        {isAr ? 'بروتوكول جراند كلينك المخصص' : 'Tailored Clinical Protocol'}
                      </p>
                      <h3 className="font-display text-2xl font-semibold text-primary mt-0.5">
                        {plan.recommendedPackageTitle}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-white p-4 border border-base-300">
                      <span className="text-xs text-base-content/60 block">
                        {isAr ? 'الطول الموجي والتبريد' : 'Wavelength & Cooling'}
                      </span>
                      <span className="font-semibold text-primary mt-0.5 block">
                        {plan.wavelengthLabel}
                      </span>
                    </div>
                    <div className="rounded-2xl bg-white p-4 border border-base-300">
                      <span className="text-xs text-base-content/60 block">
                        {isAr ? 'عدد الجلسات التقديري' : 'Estimated Roadmap'}
                      </span>
                      <span className="font-semibold text-primary mt-0.5 block">
                        {plan.estimatedSessions}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white p-4 border border-base-300 space-y-1.5">
                    <div className="text-xs font-semibold text-secondary">
                      {isAr ? 'الأخصائية المقترحة لكِ' : 'Matched Specialist'} ·{' '}
                      <span className="text-primary">
                        {SPECIALISTS.find((s) => s.id === plan.recommendedSpecialist)?.name[lang] ??
                          plan.recommendedSpecialist}
                      </span>
                    </div>
                    <p className="text-sm text-base-content/80 leading-relaxed">
                      {plan.specialistReason}
                    </p>
                    <p className="text-xs text-base-content/70 pt-1">{plan.comfortNote}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-primary">
                      {isAr ? 'تجهيزات ما قبل الجلسة' : 'Pre-Session Preparation'}
                    </div>
                    <ul className="space-y-1.5">
                      {plan.prepChecklist.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-base-content/85">
                          <CheckCircle2 className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <a
                      href={buildWhatsAppUrl(plan.whatsappPrefill)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-accent flex-1 rounded-full text-white font-semibold whatsapp-shadow"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>
                        {isAr ? 'احجزي هذا البروتوكول عبر واتساب' : 'Book This Protocol on WhatsApp'}
                      </span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between gap-6">
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-secondary">
                      {isAr ? 'المعايرة الفورية لنوع بشرتكِ' : 'Live Phototype Calibration Preview'}
                    </p>
                    <h3 className="font-display text-2xl font-semibold text-primary">
                      {baselineWave.technology}
                    </h3>
                    <p className="text-sm text-base-content/75 leading-relaxed">
                      {isAr
                        ? 'اختاري نوع البشرة والحساسية من القائمة المجاورة، ثم اضغطي على "إنشاء خطة الليزر" للحصول على توصية مخصصة بالأخصائية المناسبة وعدد الجلسات وتعليمات ما قبل الموعد.'
                        : 'Select your Fitzpatrick skin tone and sensitivity on the left, then click Generate Custom Protocol to receive a tailored specialist match (Dana, Qamar, or Duaa), session roadmap, and pre-care checklist.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-2xl bg-white p-3.5 border border-base-300">
                      <div className="font-display text-lg font-bold text-primary tabular-nums">
                        {baselineWave.wavelengthNm}nm
                      </div>
                      <div className="text-[11px] text-base-content/65">
                        {isAr ? 'الطول الموجي' : 'Wavelength'}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white p-3.5 border border-base-300">
                      <div className="font-display text-lg font-bold text-primary tabular-nums">
                        {baselineWave.coolingTempC}°C
                      </div>
                      <div className="text-[11px] text-base-content/65">
                        {isAr ? 'تبريد التلامس' : 'Cryo Tip'}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white p-3.5 border border-base-300">
                      <div className="font-display text-lg font-bold text-primary tabular-nums">
                        {baselineWave.pulseDurationMs}ms
                      </div>
                      <div className="text-[11px] text-base-content/65">
                        {isAr ? 'مدة النبضة' : 'Pulse Width'}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Tab 2: Instant Bilingual Clinic Concierge */
          <div className="rounded-3xl border brass-hairline bg-white p-6 sm:p-8 clinic-card-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-secondary">
                    {isAr ? 'استقبال جراند كلينك الفوري' : 'Tabarbour Clinic Desk'}
                  </p>
                  <h3 className="font-display text-2xl font-semibold text-primary mt-1">
                    {isAr ? 'أسئلة شائعة وسريعة' : 'Instant Answers'}
                  </h3>
                  <p className="text-sm text-base-content/75 mt-1 leading-relaxed">
                    {isAr
                      ? 'اسألي عن التبريد بدون ألم، ساعات العمل، مواقف السيارات في شارع طارق، أو وسائل الدفع.'
                      : 'Ask about painless cryo-cooling, operating hours, Tarek Street parking, or pre-session prep.'}
                  </p>
                </div>

                <div className="space-y-2">
                  {QUICK_QUESTIONS[lang].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => void sendConciergeMessage(q)}
                      disabled={chatLoading}
                      className="w-full rounded-2xl border border-base-300 bg-base-100 px-4 py-3 text-start text-xs font-medium text-primary transition-colors hover:border-secondary hover:bg-base-200"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-8 flex flex-col justify-between rounded-2xl border border-base-300 bg-base-100 p-4 sm:p-5 min-h-[340px]">
                <div className="space-y-3 overflow-y-auto max-h-[300px] pe-1">
                  {messages.length === 0 ? (
                    <div className="py-10 text-center space-y-2">
                      <MessageCircle className="mx-auto h-7 w-7 text-secondary" />
                      <p className="text-sm font-medium text-primary">
                        {isAr
                          ? 'مرحباً بكِ في مكتب استقبال جراند كلينك طبربور.'
                          : 'Welcome to the Grande Clinic Tabarbour Concierge.'}
                      </p>
                      <p className="text-xs text-base-content/65">
                        {isAr
                          ? 'اختاري سؤالاً سريعاً أو اكتبي استفساركِ بالأسفل.'
                          : 'Pick a quick question on the left or type your inquiry below.'}
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`chat ${msg.role === 'user' ? 'chat-end' : 'chat-start'}`}
                      >
                        <div
                          className={`chat-bubble text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-primary text-primary-content'
                              : 'bg-white text-base-content border border-base-300'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}

                  {chatLoading && (
                    <div className="chat chat-start">
                      <div className="chat-bubble bg-white border border-base-300 text-primary">
                        <span className="loading loading-dots loading-sm text-secondary" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-2">
                  {chatError && (
                    <div role="alert" className="alert alert-error py-2 text-xs">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{chatError}</span>
                    </div>
                  )}

                  <form onSubmit={handleChatSubmit} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={
                        isAr
                          ? 'اكتبي سؤالكِ حول الليزر أو المواعيد في طبربور...'
                          : 'Ask about laser cooling, specialists, or Tarek St. directions...'
                      }
                      aria-label={isAr ? 'رسالة للاستقبال الذكي' : 'Ask clinic concierge'}
                      className="input input-bordered flex-1 rounded-full bg-white border-base-300 focus:border-secondary text-sm"
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !chatInput.trim()}
                      aria-label={isAr ? 'إرسال السؤال' : 'Send question'}
                      className="btn btn-primary btn-circle"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

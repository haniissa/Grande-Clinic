import 'dotenv/config';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import { getRequestListener } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import {
  ALLOWED_TIME_SLOTS,
  buildWhatsAppUrl,
  CLINIC_PHONE_DISPLAY,
  CLINIC_PLUS_CODE,
  generateBookingReference,
  getRecommendedWavelength,
  validateBookingInput,
  type BookingInput,
  type BookingRecord,
  type FitzpatrickType,
  type Language,
  type SkinPlanRequest,
} from './src/utils/clinicLogic';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const BOOKINGS_STORE_PATH = '/tmp/grande-clinic-tabarbour-bookings.json';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getDefaultBookings(): BookingRecord[] {
  const today = new Date().toISOString().slice(0, 10);
  return [
    {
      id: 'seed-1001',
      reference: 'GC-TAB-1001',
      patientName: 'Lina Al-Qudah',
      phone: '0795123456',
      serviceId: 'full-body',
      specialistId: 'dana',
      date: today,
      timeSlot: '10:30',
      notes: 'Sensitive skin preference — cryo cooling level max.',
      status: 'confirmed',
      createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      whatsappUrl: buildWhatsAppUrl(
        'Hello Grande Clinic Tabarbour, confirming booking GC-TAB-1001 for Full-Body Laser with Dana.'
      ),
    },
    {
      id: 'seed-1002',
      reference: 'GC-TAB-1002',
      patientName: 'Sama Al-Nabulsi',
      phone: '0786234567',
      serviceId: 'facial-rejuvenation',
      specialistId: 'qamar',
      date: today,
      timeSlot: '14:00',
      notes: 'HydraFacial Glow Elite before weekend event.',
      status: 'confirmed',
      createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
      whatsappUrl: buildWhatsAppUrl(
        'Hello Grande Clinic Tabarbour, confirming booking GC-TAB-1002 for Facial Rejuvenation with Qamar.'
      ),
    },
  ];
}

function loadBookings(): BookingRecord[] {
  try {
    if (fs.existsSync(BOOKINGS_STORE_PATH)) {
      const raw = fs.readFileSync(BOOKINGS_STORE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed as BookingRecord[];
      }
    }
  } catch {
    // Fall back to deterministic seed bookings if tmp file is unreadable
  }
  return getDefaultBookings();
}

function saveBookings(records: BookingRecord[]): void {
  try {
    fs.writeFileSync(BOOKINGS_STORE_PATH, JSON.stringify(records, null, 2), 'utf-8');
  } catch {
    // Non-fatal in read-only environments; in-memory state still updates
  }
}

let bookingsStore: BookingRecord[] = loadBookings();
let bookingSequence = Math.max(
  bookingsStore.length + 10,
  ...bookingsStore.map((b) => {
    const match = b.reference.match(/(\d+)$/);
    return match ? Number(match[1]) - 1000 : 0;
  })
);

const app = new Hono();

app.use('/api/*', cors());

app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    framework: 'hono',
    clinic: 'Grande Clinic Tabarbour',
    location: 'Tarek St., Tabarbour, Amman',
    plusCode: CLINIC_PLUS_CODE,
    aiConfigured: Boolean(getGeminiClient()),
  });
});

app.get('/api/clinic/info', (c) => {
  return c.json({
    name: 'Grande Clinic Tabarbour',
    nameAr: 'جراند كلينك طبربور',
    phone: CLINIC_PHONE_DISPLAY,
    plusCode: CLINIC_PLUS_CODE,
    address: 'Tarek Street, Tabarbour, Amman, Jordan',
    addressAr: 'شارع طارق، طبربور، عمّان، الأردنية الهاشمية',
    hours: '08:00 – 19:00',
    rating: 4.5,
    reviewCount: 1200,
    specialists: ['dana', 'qamar', 'duaa'],
    availableSlots: ALLOWED_TIME_SLOTS,
  });
});

app.get('/api/bookings', (c) => {
  const active = bookingsStore.filter((b) => b.status === 'confirmed');
  return c.json({
    bookings: active,
    total: active.length,
  });
});

app.post('/api/bookings', async (c) => {
  let body: Partial<BookingInput> & { lang?: Language };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON request payload.' }, 400);
  }

  const lang: Language = body.lang === 'ar' ? 'ar' : 'en';
  const validation = validateBookingInput(body, lang);

  if (!validation.valid) {
    return c.json(
      {
        error:
          lang === 'ar'
            ? 'يرجى التحقق من الحقول المطلوبة وإكمالها بشكل صحيح.'
            : 'Please review and fix the highlighted appointment fields.',
        fieldErrors: validation.errors,
      },
      400
    );
  }

  bookingSequence += 1;
  const reference = generateBookingReference(bookingSequence);
  const serviceLabels: Record<string, string> = {
    'full-body': lang === 'ar' ? 'باقة الجسم الكامل بالليزر' : 'Full-Body Laser Package',
    'facial-rejuvenation': lang === 'ar' ? 'نضارة وتجديد البشرة' : 'Facial & Skin Rejuvenation',
    'targeted-laser': lang === 'ar' ? 'جلسة منطقة محددة' : 'Targeted Laser Session',
    'free-assessment': lang === 'ar' ? 'استشارة وفحص بشرة مجاني' : 'Complimentary Skin Assessment',
  };
  const specialistLabels: Record<string, string> = {
    dana: lang === 'ar' ? 'دانا' : 'Dana',
    qamar: lang === 'ar' ? 'قمر' : 'Qamar',
    duaa: lang === 'ar' ? 'دعاء' : 'Duaa',
  };

  const waMessage =
    lang === 'ar'
      ? `مرحباً جراند كلينك طبربور، تم تسجيل طلب الحجز رقم ${reference} باسم ${body.patientName?.trim()} لخدمة ${serviceLabels[body.serviceId!]} مع الأخصائية ${specialistLabels[body.specialistId!]} بتاريخ ${body.date} الساعة ${body.timeSlot}.`
      : `Hello Grande Clinic Tabarbour, confirming reservation ${reference} for ${body.patientName?.trim()} — ${serviceLabels[body.serviceId!]} with specialist ${specialistLabels[body.specialistId!]} on ${body.date} at ${body.timeSlot}.`;

  const record: BookingRecord = {
    id: `bk-${Date.now()}-${bookingSequence}`,
    reference,
    patientName: body.patientName!.trim(),
    phone: validation.normalizedPhone,
    serviceId: body.serviceId!,
    specialistId: body.specialistId!,
    date: body.date!.trim(),
    timeSlot: body.timeSlot!.trim(),
    notes: (body.notes ?? '').trim().slice(0, 400),
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    whatsappUrl: buildWhatsAppUrl(waMessage),
  };

  bookingsStore = [record, ...bookingsStore];
  saveBookings(bookingsStore);

  return c.json({ booking: record }, 201);
});

app.delete('/api/bookings/:id', (c) => {
  const id = c.req.param('id');
  const idx = bookingsStore.findIndex((b) => b.id === id);
  if (idx === -1) {
    return c.json({ error: 'Booking not found.' }, 404);
  }
  bookingsStore = bookingsStore.filter((b) => b.id !== id);
  saveBookings(bookingsStore);
  return c.json({ deleted: true, id });
});

app.post('/api/ai/skin-plan', async (c) => {
  let body: Partial<SkinPlanRequest>;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON payload.' }, 400);
  }

  const lang: Language = body.lang === 'ar' ? 'ar' : 'en';
  const fitzpatrick = Number(body.fitzpatrick) as FitzpatrickType;
  if (![1, 2, 3, 4, 5, 6].includes(fitzpatrick)) {
    return c.json({ error: 'Fitzpatrick skin type must be between 1 and 6.' }, 400);
  }

  const ai = getGeminiClient();
  if (!ai) {
    return c.json(
      {
        error:
          lang === 'ar'
            ? 'خدمة المستشار الذكي غير مفعلة حالياً (مفتاح GEMINI_API_KEY غير مضبوط في الإعدادات).'
            : 'Gemini AI advisor is not configured on this server (GEMINI_API_KEY missing in Secrets).',
        code: 'AI_KEY_MISSING',
      },
      503
    );
  }

  const baseline = getRecommendedWavelength(fitzpatrick);
  const serviceId = body.serviceId ?? 'full-body';
  const sensitivity = body.sensitivity ?? 'moderate';
  const targetArea = (body.targetArea ?? 'Full body').trim().slice(0, 160);
  const notes = (body.notes ?? '').trim().slice(0, 400);

  const systemInstruction = `You are the senior clinical intake coordinator at Grande Clinic Tabarbour (جراند كلينك طبربور) on Tarek Street, Tabarbour, Amman, Jordan.
The clinic offers:
- Full-Body Laser Hair Removal (GentleMax Pro dual-wavelength 755nm Alexandrite / 1064nm Nd:YAG with sub-zero contact cooling)
- Facial & Skin Rejuvenation (HydraFacial Glow Elite, Carbon Laser Hollywood Peel, Microneedling)
- Targeted Laser Sessions (underarms, arms, legs, bikini, men's beard contouring)
- Complimentary Skin Assessment & Patch Test
Certified female specialists:
- dana: Gentle touch, ideal for sensitive skin, delicate zones, and nervous first-time laser clients.
- qamar: Fast, uniform full-body laser passes and HydraFacial deep pore glow treatments.
- duaa: Clinical safety & phototype calibration lead, ideal for darker phototypes (IV-VI), melanin evaluation, and patch tests.

Respond STRICTLY in ${lang === 'ar' ? 'natural, warm Jordanian/Modern Standard Arabic' : 'refined, clear clinical English'}.
Keep every field concise, practical, and medically reassuring (do not diagnose skin diseases; recommend an in-clinic patch test).
Ensure recommendedMode matches one of: "alexandrite" (Fitzpatrick I-III), "ndyag" (Fitzpatrick IV-VI), or "cryo" (if high sensitivity or facial cooling).
Ensure recommendedSpecialist matches one of: "dana", "qamar", or "duaa".`;

  const prompt = `Patient clinical intake profile:
- Fitzpatrick Skin Type: ${fitzpatrick} (baseline safe laser wavelength: ${baseline.technology})
- Desired Service: ${serviceId}
- Skin Sensitivity: ${sensitivity}
- Primary Focus Area: ${targetArea}
- Extra Notes: ${notes || 'None'}

Generate a tailored, reassuring clinic session roadmap.`;

  const schemaConfig = {
    systemInstruction,
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        recommendedMode: {
          type: Type.STRING,
          description: 'Must be one of: alexandrite, ndyag, cryo',
        },
        wavelengthLabel: {
          type: Type.STRING,
          description: 'Short label for the recommended wavelength & cooling setting',
        },
        recommendedSpecialist: {
          type: Type.STRING,
          description: 'Must be one of: dana, qamar, duaa',
        },
        specialistReason: {
          type: Type.STRING,
          description: 'One concise sentence explaining why this specialist suits the patient',
        },
        recommendedPackageTitle: {
          type: Type.STRING,
          description: 'Recommended Grande Clinic package title',
        },
        estimatedSessions: {
          type: Type.STRING,
          description: 'Typical session count range and interval (e.g. 6-8 sessions, every 4-6 weeks)',
        },
        comfortNote: {
          type: Type.STRING,
          description: 'Brief note on how cryo-cooling ensures comfort for their sensitivity level',
        },
        prepChecklist: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '3 to 4 practical pre-session preparation steps',
        },
        whatsappPrefill: {
          type: Type.STRING,
          description: 'Ready-to-send concise WhatsApp booking message mentioning their profile and specialist',
        },
      },
      required: [
        'recommendedMode',
        'wavelengthLabel',
        'recommendedSpecialist',
        'specialistReason',
        'recommendedPackageTitle',
        'estimatedSessions',
        'comfortNote',
        'prepChecklist',
        'whatsappPrefill',
      ],
    },
  };

  try {
    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          ...schemaConfig,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
        },
      });
    } catch (primaryErr: unknown) {
      const errText = primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
      if (errText.includes('503') || errText.includes('UNAVAILABLE') || errText.includes('high demand')) {
        response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config: schemaConfig,
        });
      } else {
        throw primaryErr;
      }
    }

    const rawText = (response.text ?? '').trim();
    const parsed = JSON.parse(rawText);
    return c.json({ plan: parsed });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to generate skin protocol.';
    return c.json(
      {
        error:
          lang === 'ar'
            ? `تعذر توليد خطة الليزر عبر Gemini حالياً: ${message}`
            : `Unable to generate Gemini laser plan right now: ${message}`,
        code: 'AI_UPSTREAM_ERROR',
      },
      502
    );
  }
});

app.post('/api/ai/consult', async (c) => {
  let body: { message?: string; lang?: Language; history?: Array<{ role: string; text: string }> };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON payload.' }, 400);
  }

  const lang: Language = body.lang === 'ar' ? 'ar' : 'en';
  const userMessage = (body.message ?? '').trim();
  if (!userMessage) {
    return c.json(
      { error: lang === 'ar' ? 'يرجى كتابة سؤالكِ أولاً.' : 'Please enter your question first.' },
      400
    );
  }

  const ai = getGeminiClient();
  if (!ai) {
    return c.json(
      {
        error:
          lang === 'ar'
            ? 'مكتب الاستقبال الذكي غير مفعل حالياً (يرجى التأكد من مفتاح GEMINI_API_KEY في الإعدادات).'
            : 'AI Concierge is unavailable because GEMINI_API_KEY is not configured in Secrets.',
        code: 'AI_KEY_MISSING',
      },
      503
    );
  }

  const historyContext = (body.history ?? [])
    .slice(-6)
    .map((m) => `${m.role === 'user' ? 'Patient' : 'Concierge'}: ${m.text}`)
    .join('\n');

  const systemInstruction = `You are the fast, polite reception concierge for Grande Clinic Tabarbour (جراند كلينك طبربور), a Ministry of Health licensed medical dermatology and laser hair removal studio on Tarek Street, Tabarbour, Amman, Jordan (Plus Code: 2W3P+6X9).
Verified facts you must stick to:
- Phone & WhatsApp: 07 9919 1660 (https://wa.me/962799191660)
- Hours: Open 7 days a week, 8:00 AM – 7:00 PM. Strict appointment-only policy so there is zero waiting time.
- Rating: 4.5 stars on Google Maps with 1,200+ verified reviews.
- Specialists: Dana (Senior Laser Specialist, gentle for sensitive areas), Qamar (Laser & Skin Specialist, full-body & HydraFacial), Duaa (Aesthetic & Safety Lead, phototype calibration & patch tests).
- Treatments: Full-Body Laser (with sub-zero contact cooling), Facial & Skin Rejuvenation (HydraFacial Glow Elite, Carbon Laser Peel, Microneedling), Targeted Laser Zones (underarms, legs, arms, bikini, men's beard contour), and Complimentary Skin Assessment & Patch Test.
- Payments: Visa, MasterCard, Jordanian Debit cards, and Cash at reception. Dedicated patient parking on Tarek Street.
- Reply in ${lang === 'ar' ? 'warm, concise Arabic' : 'warm, concise English'} in 2 to 4 crisp sentences. Never invent exact JOD prices; invite the patient to book a free assessment or message WhatsApp for package rates.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: historyContext
        ? `${historyContext}\nPatient: ${userMessage}`
        : userMessage,
      config: {
        systemInstruction,
      },
    });

    const reply = (response.text ?? '').trim();
    if (!reply) {
      throw new Error('Empty response received from Gemini.');
    }
    return c.json({ reply });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Concierge request failed.';
    return c.json(
      {
        error:
          lang === 'ar'
            ? `تعذر الاتصال بمكتب الاستقبال الذكي: ${message}`
            : `Unable to reach AI Concierge right now: ${message}`,
        code: 'AI_UPSTREAM_ERROR',
      },
      502
    );
  }
});

if (IS_PROD) {
  app.use('/*', serveStatic({ root: './dist' }));
  app.get('*', (c) => {
    const indexPath = path.resolve(__dirname, 'dist', 'index.html');
    const html = fs.readFileSync(indexPath, 'utf-8');
    return c.html(html);
  });
}

async function startServer() {
  const honoListener = getRequestListener(app.fetch);

  if (IS_PROD) {
    const server = http.createServer((req, res) => {
      honoListener(req, res);
    });
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Grande Clinic Tabarbour (Hono.js production) running on http://0.0.0.0:${PORT}`);
    });
    return;
  }

  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  const server = http.createServer((req, res) => {
    const url = req.url ?? '/';
    if (url.startsWith('/api/')) {
      honoListener(req, res);
      return;
    }
    vite.middlewares(req, res, () => {
      res.statusCode = 404;
      res.end('Not Found');
    });
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Grande Clinic Tabarbour (Hono.js + Vite dev) running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Grande Clinic Hono server:', err);
  process.exit(1);
});

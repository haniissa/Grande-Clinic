export type Language = 'en' | 'ar';

export type LaserMode = 'alexandrite' | 'ndyag' | 'cryo';

export type FitzpatrickType = 1 | 2 | 3 | 4 | 5 | 6;

export type SpecialistId = 'dana' | 'qamar' | 'duaa';

export type ServiceId =
  | 'full-body'
  | 'facial-rejuvenation'
  | 'targeted-laser'
  | 'free-assessment';

export interface BookingInput {
  patientName: string;
  phone: string;
  serviceId: ServiceId;
  specialistId: SpecialistId;
  date: string;
  timeSlot: string;
  notes?: string;
}

export interface BookingRecord extends BookingInput {
  id: string;
  reference: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  whatsappUrl: string;
}

export interface BookingValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof BookingInput, string>>;
  normalizedPhone: string;
}

export interface WavelengthRecommendation {
  mode: LaserMode;
  wavelengthNm: number;
  technology: string;
  coolingTempC: number;
  pulseDurationMs: number;
}

export interface SkinPlanRequest {
  lang: Language;
  fitzpatrick: FitzpatrickType;
  serviceId: ServiceId;
  sensitivity: 'low' | 'moderate' | 'high';
  targetArea: string;
  notes?: string;
}

export interface SkinPlanResponse {
  recommendedMode: LaserMode;
  wavelengthLabel: string;
  recommendedSpecialist: SpecialistId;
  specialistReason: string;
  recommendedPackageTitle: string;
  estimatedSessions: string;
  comfortNote: string;
  prepChecklist: string[];
  whatsappPrefill: string;
}

export const CLINIC_PHONE_DISPLAY = '07 9919 1660';
export const CLINIC_PHONE_TEL = 'tel:0799191660';
export const CLINIC_WHATSAPP_NUMBER = '962799191660';
export const CLINIC_PLUS_CODE = '2W3P+6X9';
export const CLINIC_LAT = 32.0030427;
export const CLINIC_LNG = 35.9374969;
export const CLINIC_SITE_URL = 'https://haniissa.github.io/Grande-Clinic/';
export const CLINIC_MAPS_URL =
  'https://www.google.com/maps/place/Grande+Clinic+Tabarbour/@32.0030427,35.9374969,771m/data=!3m2!1e3!4b1!4m6!3m5!1s0x151b6104efac6569:0xad1f53926a6cfaef!8m2!3d32.0030427!4d35.9374969!16s%2Fg%2F11n76vxxc1';
export const CLINIC_MAPS_DIRECTIONS_URL =
  'https://www.google.com/maps/dir/?api=1&destination=32.0030427,35.9374969';
export const CLINIC_MAPS_EMBED_URL =
  'https://www.google.com/maps?q=32.0030427,35.9374969&z=17&output=embed';

export const ALLOWED_TIME_SLOTS = [
  '08:30',
  '09:30',
  '10:30',
  '11:30',
  '12:30',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
] as const;

export const ALLOWED_SERVICES: readonly ServiceId[] = [
  'full-body',
  'facial-rejuvenation',
  'targeted-laser',
  'free-assessment',
];

export const ALLOWED_SPECIALISTS: readonly SpecialistId[] = [
  'dana',
  'qamar',
  'duaa',
];

export function buildWhatsAppUrl(
  message: string,
  phoneNumber: string = CLINIC_WHATSAPP_NUMBER
): string {
  const cleanPhone = phoneNumber.replace(/[^\d]/g, '');
  const trimmed = message.trim();
  if (!trimmed) {
    return `https://wa.me/${cleanPhone}`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(trimmed)}`;
}

export function normalizeJordanianPhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '');
  if (digits.startsWith('00962')) {
    return `0${digits.slice(5)}`;
  }
  if (digits.startsWith('962') && digits.length === 12) {
    return `0${digits.slice(3)}`;
  }
  return digits;
}

export function isValidJordanianPhone(raw: string): boolean {
  const normalized = normalizeJordanianPhone(raw);
  return /^07[789]\d{7}$/.test(normalized);
}

export function validateBookingInput(
  input: Partial<BookingInput>,
  lang: Language = 'en'
): BookingValidationResult {
  const errors: Partial<Record<keyof BookingInput, string>> = {};
  const isAr = lang === 'ar';

  const name = (input.patientName ?? '').trim();
  if (name.length < 2) {
    errors.patientName = isAr
      ? 'يرجى إدخال الاسم الكامل (حرفين على الأقل).'
      : 'Please enter your full name (at least 2 characters).';
  }

  const normalizedPhone = normalizeJordanianPhone(input.phone ?? '');
  if (!isValidJordanianPhone(normalizedPhone)) {
    errors.phone = isAr
      ? 'يرجى إدخال رقم هاتف أردني صحيح (مثل 0799191660).'
      : 'Enter a valid Jordanian mobile number (e.g., 0799191660).';
  }

  if (!input.serviceId || !ALLOWED_SERVICES.includes(input.serviceId)) {
    errors.serviceId = isAr
      ? 'يرجى اختيار الباقة أو الجلسة المطلوبة.'
      : 'Please select a valid treatment package.';
  }

  if (!input.specialistId || !ALLOWED_SPECIALISTS.includes(input.specialistId)) {
    errors.specialistId = isAr
      ? 'يرجى اختيار الأخصائية المفضلة.'
      : 'Please select a certified specialist.';
  }

  const dateStr = (input.date ?? '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    errors.date = isAr
      ? 'يرجى اختيار تاريخ صحيح للموعد.'
      : 'Please choose a valid appointment date.';
  }

  const slot = (input.timeSlot ?? '').trim();
  if (!ALLOWED_TIME_SLOTS.includes(slot as (typeof ALLOWED_TIME_SLOTS)[number])) {
    errors.timeSlot = isAr
      ? 'يرجى اختيار وقت ضمن ساعات العمل (٨:٣٠ ص – ٦:٠٠ م).'
      : 'Select an available slot within clinic hours (8:30 AM – 6:00 PM).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    normalizedPhone,
  };
}

export function getRecommendedWavelength(
  fitzpatrick: FitzpatrickType
): WavelengthRecommendation {
  if (fitzpatrick <= 3) {
    return {
      mode: 'alexandrite',
      wavelengthNm: 755,
      technology: '755nm Alexandrite + Cryo DCD',
      coolingTempC: -4,
      pulseDurationMs: 3,
    };
  }
  return {
    mode: 'ndyag',
    wavelengthNm: 1064,
    technology: '1064nm Nd:YAG + Cryo DCD',
    coolingTempC: -6,
    pulseDurationMs: 10,
  };
}

export function computeClinicOpenStatus(hour: number, minute: number): {
  isOpen: boolean;
  opensAt: string;
  closesAt: string;
} {
  const totalMinutes = hour * 60 + minute;
  const openMinutes = 8 * 60; // 08:00
  const closeMinutes = 19 * 60; // 19:00
  return {
    isOpen: totalMinutes >= openMinutes && totalMinutes < closeMinutes,
    opensAt: '08:00',
    closesAt: '19:00',
  };
}

export function generateBookingReference(sequence: number): string {
  const safeNum = Math.max(1, Math.floor(sequence));
  return `GC-TAB-${String(1000 + safeNum)}`;
}

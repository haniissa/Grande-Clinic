import { useEffect, useState, type FormEvent } from 'react';
import { Calendar, CheckCircle2, Clock, MessageCircle, Phone, User, X } from 'lucide-react';
import { SERVICE_PACKAGES, SPECIALISTS } from '../data/clinicContent';
import {
  ALLOWED_TIME_SLOTS,
  validateBookingInput,
  type BookingInput,
  type BookingRecord,
  type Language,
  type ServiceId,
  type SpecialistId,
} from '../utils/clinicLogic';

interface BookingModalProps {
  open: boolean;
  lang: Language;
  initialServiceId: ServiceId;
  initialSpecialistId?: SpecialistId;
  initialNotes?: string;
  onClose: () => void;
  onBookingCreated: (booking: BookingRecord) => void;
}

function getTomorrowIsoDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function BookingModal({
  open,
  lang,
  initialServiceId,
  initialSpecialistId = 'dana',
  initialNotes = '',
  onClose,
  onBookingCreated,
}: BookingModalProps) {
  const isAr = lang === 'ar';

  const [patientName, setPatientName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceId, setServiceId] = useState<ServiceId>(initialServiceId);
  const [specialistId, setSpecialistId] = useState<SpecialistId>(initialSpecialistId);
  const [date, setDate] = useState<string>(getTomorrowIsoDate());
  const [timeSlot, setTimeSlot] = useState<string>('10:30');
  const [notes, setNotes] = useState<string>(initialNotes);

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof BookingInput, string>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<BookingRecord | null>(null);

  useEffect(() => {
    if (open) {
      setServiceId(initialServiceId);
      setSpecialistId(initialSpecialistId);
      if (initialNotes) setNotes(initialNotes);
      setFieldErrors({});
      setServerError(null);
      setConfirmed(null);
    }
  }, [open, initialServiceId, initialSpecialistId, initialNotes]);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const payload: BookingInput = {
      patientName,
      phone,
      serviceId,
      specialistId,
      date,
      timeSlot,
      notes,
    };

    const validation = validateBookingInput(payload, lang);
    if (!validation.valid) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, lang }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        setServerError(data.error || (isAr ? 'تعذر إرسال الحجز.' : 'Could not submit reservation.'));
        return;
      }

      setConfirmed(data.booking as BookingRecord);
      onBookingCreated(data.booking as BookingRecord);
    } catch {
      setServerError(
        isAr
          ? 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.'
          : 'Network error while saving your reservation. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="modal modal-open bg-black/45"
    >
      <div className="modal-box max-w-2xl rounded-3xl border brass-hairline bg-base-100 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-base-300 pb-4">
          <div>
            <p className="text-xs font-semibold text-secondary">
              {isAr
                ? 'جراند كلينك طبربور · شارع طارق · الحجز المسبق الإلزامي'
                : 'Grande Clinic Tabarbour · Tarek St. · Strict Appointment Suite'}
            </p>
            <h2 id="booking-modal-title" className="font-display text-2xl font-semibold text-primary mt-1">
              {confirmed
                ? isAr
                  ? 'تم تأكيد طلب موعدكِ بنجاح'
                  : 'Appointment Reserved'
                : isAr
                  ? 'حجز موعد في عيادة طبربور'
                  : 'Reserve Your Private Suite'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق نافذة الحجز' : 'Close booking modal'}
            className="btn btn-sm btn-circle btn-ghost text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {confirmed ? (
          <div className="mt-6 space-y-5">
            <div className="alert bg-base-200 border brass-hairline text-primary">
              <CheckCircle2 className="h-6 w-6 text-accent shrink-0" />
              <div>
                <div className="text-xs font-semibold text-secondary">
                  {isAr ? 'رقم المرجع الطبي' : 'Reservation Reference'}
                </div>
                <div className="font-mono text-lg font-bold tracking-wide tabular-nums">
                  {confirmed.reference}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl bg-base-200/70 p-4 text-sm">
              <div>
                <span className="text-xs text-base-content/65 block">
                  {isAr ? 'الاسم' : 'Patient'}
                </span>
                <span className="font-semibold text-primary">{confirmed.patientName}</span>
              </div>
              <div>
                <span className="text-xs text-base-content/65 block">
                  {isAr ? 'الهاتف' : 'Mobile'}
                </span>
                <span className="font-semibold text-primary tabular-nums" dir="ltr">
                  {confirmed.phone}
                </span>
              </div>
              <div>
                <span className="text-xs text-base-content/65 block">
                  {isAr ? 'التاريخ والوقت' : 'Date & Time'}
                </span>
                <span className="font-semibold text-primary tabular-nums">
                  {confirmed.date} · {confirmed.timeSlot}
                </span>
              </div>
              <div>
                <span className="text-xs text-base-content/65 block">
                  {isAr ? 'الأخصائية' : 'Specialist'}
                </span>
                <span className="font-semibold text-primary">
                  {SPECIALISTS.find((s) => s.id === confirmed.specialistId)?.name[lang]}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={confirmed.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-accent flex-1 rounded-full text-white font-semibold whatsapp-shadow"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{isAr ? 'إرسال التأكيد عبر واتساب' : 'Send Confirmation on WhatsApp'}</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline border-base-300 rounded-full text-primary"
              >
                {isAr ? 'العودة للعيادة' : 'Done'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
            {serverError && (
              <div role="alert" className="alert alert-error text-sm py-2.5">
                <span>{serverError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control">
                <label htmlFor="booking-name" className="label pb-1">
                  <span className="label-text text-xs font-semibold text-primary flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-secondary" />
                    {isAr ? 'الاسم الكامل' : 'Full Name'}
                  </span>
                </label>
                <input
                  id="booking-name"
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder={isAr ? 'مثال: رانيا المجالي' : 'e.g., Rania Al-Majali'}
                  className={`input input-bordered w-full bg-base-200/70 focus:border-secondary ${
                    fieldErrors.patientName ? 'input-error' : 'border-base-300'
                  }`}
                />
                {fieldErrors.patientName && (
                  <p className="mt-1 text-xs text-error">{fieldErrors.patientName}</p>
                )}
              </div>

              <div className="form-control">
                <label htmlFor="booking-phone" className="label pb-1">
                  <span className="label-text text-xs font-semibold text-primary flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-secondary" />
                    {isAr ? 'رقم الموبايل (الأردن)' : 'Jordanian Mobile'}
                  </span>
                </label>
                <input
                  id="booking-phone"
                  type="tel"
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="079 919 1660"
                  className={`input input-bordered w-full bg-base-200/70 focus:border-secondary ${
                    fieldErrors.phone ? 'input-error' : 'border-base-300'
                  }`}
                />
                {fieldErrors.phone && (
                  <p className="mt-1 text-xs text-error">{fieldErrors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-control">
                <label htmlFor="booking-service" className="label pb-1">
                  <span className="label-text text-xs font-semibold text-primary">
                    {isAr ? 'الباقة أو الجلسة' : 'Treatment Package'}
                  </span>
                </label>
                <select
                  id="booking-service"
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value as ServiceId)}
                  className="select select-bordered w-full bg-base-200/70 border-base-300 focus:border-secondary"
                >
                  {SERVICE_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.title[lang]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label htmlFor="booking-specialist" className="label pb-1">
                  <span className="label-text text-xs font-semibold text-primary">
                    {isAr ? 'الأخصائية المفضلة' : 'Preferred Specialist'}
                  </span>
                </label>
                <select
                  id="booking-specialist"
                  value={specialistId}
                  onChange={(e) => setSpecialistId(e.target.value as SpecialistId)}
                  className="select select-bordered w-full bg-base-200/70 border-base-300 focus:border-secondary"
                >
                  {SPECIALISTS.map((sp) => (
                    <option key={sp.id} value={sp.id}>
                      {sp.name[lang]} — {sp.role[lang]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-control">
              <label htmlFor="booking-date" className="label pb-1">
                <span className="label-text text-xs font-semibold text-primary flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-secondary" />
                  {isAr ? 'تاريخ الموعد' : 'Preferred Date'}
                </span>
              </label>
              <input
                id="booking-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`input input-bordered w-full bg-base-200/70 focus:border-secondary ${
                  fieldErrors.date ? 'input-error' : 'border-base-300'
                }`}
              />
              {fieldErrors.date && <p className="mt-1 text-xs text-error">{fieldErrors.date}</p>}
            </div>

            <div>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Clock className="h-3.5 w-3.5 text-secondary" />
                <span>{isAr ? 'اختاري الوقت المناسب (٨:٣٠ ص – ٦:٠٠ م)' : 'Select Suite Time Slot (8:30 AM – 6:00 PM)'}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {ALLOWED_TIME_SLOTS.map((slot) => {
                  const selected = timeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`btn btn-sm rounded-full tabular-nums font-medium ${
                        selected
                          ? 'bg-primary text-[#ffdea5] border-primary hover:bg-primary'
                          : 'bg-base-200/80 text-primary border-base-300 hover:border-secondary'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              {fieldErrors.timeSlot && (
                <p className="mt-1 text-xs text-error">{fieldErrors.timeSlot}</p>
              )}
            </div>

            <div className="form-control">
              <label htmlFor="booking-notes" className="label pb-1">
                <span className="label-text text-xs font-semibold text-primary">
                  {isAr ? 'ملاحظات للبشرة أو الحساسية (اختياري)' : 'Skin Sensitivity or Session Notes (Optional)'}
                </span>
              </label>
              <textarea
                id="booking-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  isAr
                    ? 'مثال: أول جلسة ليزر، بشرة حساسة، أرغب بتجربة النبضة...'
                    : 'e.g., First laser session, sensitive skin, request free patch test...'
                }
                className="textarea textarea-bordered w-full bg-base-200/70 border-base-300 focus:border-secondary"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost rounded-full text-primary"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary rounded-full px-7 text-primary-content font-semibold"
              >
                {submitting && <span className="loading loading-spinner loading-xs" />}
                <span>{isAr ? 'تأكيد حجز الموعد' : 'Confirm Reservation'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

import { Calendar, MessageCircle, Trash2, X } from 'lucide-react';
import { SERVICE_PACKAGES, SPECIALISTS } from '../data/clinicContent';
import type { BookingRecord, Language } from '../utils/clinicLogic';

interface ReservationsDrawerProps {
  open: boolean;
  lang: Language;
  bookings: BookingRecord[];
  loading: boolean;
  onClose: () => void;
  onCancelBooking: (id: string) => Promise<void>;
  onNewBooking: () => void;
}

export function ReservationsDrawer({
  open,
  lang,
  bookings,
  loading,
  onClose,
  onCancelBooking,
  onNewBooking,
}: ReservationsDrawerProps) {
  if (!open) return null;
  const isAr = lang === 'ar';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservations-title"
      className="modal modal-open bg-black/45"
    >
      <div className="modal-box max-w-2xl rounded-3xl border brass-hairline bg-base-100 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-base-300 pb-4">
          <div>
            <p className="text-xs font-semibold text-secondary">
              {isAr ? 'جدول المواعيد المحفوظة' : 'Tabarbour Suite Schedule'}
            </p>
            <h2 id="reservations-title" className="font-display text-2xl font-semibold text-primary mt-1">
              {isAr ? 'المواعيد المؤكدة' : 'Confirmed Reservations'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق سجل المواعيد' : 'Close reservations'}
            className="btn btn-sm btn-circle btn-ghost text-primary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 max-h-[58vh] overflow-y-auto space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <span className="loading loading-spinner loading-md text-secondary" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="rounded-2xl bg-base-200 p-8 text-center">
              <Calendar className="mx-auto h-8 w-8 text-secondary" />
              <p className="mt-3 font-medium text-primary">
                {isAr ? 'لا توجد مواعيد محجوزة حالياً.' : 'No reservations scheduled yet.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNewBooking();
                }}
                className="btn btn-primary btn-sm rounded-full mt-4"
              >
                {isAr ? 'احجزي أول موعد' : 'Book First Appointment'}
              </button>
            </div>
          ) : (
            bookings.map((bk) => {
              const serviceName =
                SERVICE_PACKAGES.find((s) => s.id === bk.serviceId)?.title[lang] ?? bk.serviceId;
              const specialistName =
                SPECIALISTS.find((s) => s.id === bk.specialistId)?.name[lang] ?? bk.specialistId;

              return (
                <div
                  key={bk.id}
                  className="rounded-2xl border border-base-300 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-base-content/65">
                      <span className="font-mono font-bold text-secondary tabular-nums">
                        {bk.reference}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        {bk.date} {bk.timeSlot}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {isAr ? `الأخصائية ${specialistName}` : `Specialist ${specialistName}`}
                      </span>
                    </div>
                    <h3 className="font-semibold text-primary text-base">
                      {bk.patientName} — {serviceName}
                    </h3>
                    <div className="text-xs text-base-content/70 tabular-nums" dir="ltr">
                      {bk.phone}
                    </div>
                    {bk.notes && (
                      <p className="text-xs text-base-content/70 pt-0.5">{bk.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={bk.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={
                        isAr
                          ? `واتساب للموعد ${bk.reference}`
                          : `WhatsApp confirmation for ${bk.reference}`
                      }
                      className="btn btn-sm btn-accent rounded-full text-white"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => onCancelBooking(bk.id)}
                      aria-label={
                        isAr ? `إلغاء الموعد ${bk.reference}` : `Cancel reservation ${bk.reference}`
                      }
                      className="btn btn-sm btn-ghost btn-circle text-error hover:bg-error/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-base-300 pt-4">
          <span className="text-xs text-base-content/65 tabular-nums">
            {isAr ? `إجمالي المواعيد: ${bookings.length}` : `Total active slots: ${bookings.length}`}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onNewBooking();
              }}
              className="btn btn-primary btn-sm rounded-full px-4"
            >
              {isAr ? 'موعد جديد' : 'New Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

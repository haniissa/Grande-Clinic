import { CalendarCheck2, Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { CLINIC_IMAGES, UI_COPY } from '../data/clinicContent';
import type { Language } from '../utils/clinicLogic';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  onOpenBooking: () => void;
  onOpenReservations: () => void;
  reservationsCount: number;
}

export function Header({
  lang,
  onToggleLang,
  onOpenBooking,
  onOpenReservations,
  reservationsCount,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const copy = UI_COPY[lang];

  const navItems = [
    { href: '#laser-packages', label: copy.nav.services },
    { href: '#ai-advisor', label: copy.nav.aiAdvisor },
    { href: '#specialists', label: copy.nav.specialists },
    { href: '#reviews', label: copy.nav.reviews },
    { href: '#location-directions', label: copy.nav.location },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-base-300 bg-base-100/95">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between gap-2 sm:gap-6 px-3 sm:px-6 lg:px-10">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#top"
          className="flex items-center gap-2 sm:gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-secondary"
        >
          <span className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center overflow-hidden rounded-full border brass-hairline bg-white shrink-0">
            <img
              src={CLINIC_IMAGES.logo}
              alt="Grande Clinic Tabarbour"
              className="h-full w-full object-contain [transform:scale(4.6)_translateX(37%)]"
              referrerPolicy="no-referrer"
            />
          </span>
          <span className="font-display text-base sm:text-xl font-semibold tracking-tight text-primary">
            {copy.brandName}
          </span>
        </a>

        {/* Zone 2: 5 Clean Single-Line Nav Links */}
        <nav
          aria-label={lang === 'ar' ? 'التنقل الرئيسي' : 'Primary navigation'}
          className="hidden lg:flex items-center gap-7"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-base-content/75 transition-colors hover:text-primary hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Language Switch + Reservations + 1 Primary Action */}
        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleLang}
            aria-label={
              lang === 'ar' ? 'Switch interface to English' : 'تبديل الواجهة إلى اللغة العربية'
            }
            className="btn btn-ghost btn-sm px-2 sm:px-3 gap-1 sm:gap-1.5 text-xs font-semibold text-primary whitespace-nowrap shrink-0"
          >
            <Globe className="h-3.5 w-3.5 text-secondary shrink-0" />
            <span>{copy.langSwitch}</span>
          </button>

          <button
            type="button"
            onClick={onOpenReservations}
            aria-label={
              lang === 'ar'
                ? `عرض حجوزاتي (${reservationsCount})`
                : `View reservations (${reservationsCount})`
            }
            className="btn btn-ghost btn-sm hidden sm:inline-flex gap-1.5 text-xs font-semibold text-primary whitespace-nowrap shrink-0"
          >
            <CalendarCheck2 className="h-4 w-4 text-secondary" />
            <span>{copy.myBookings}</span>
            <span className="tabular-nums text-secondary">({reservationsCount})</span>
          </button>

          <button
            type="button"
            onClick={onOpenBooking}
            className="btn btn-primary btn-sm rounded-full px-3 sm:px-5 text-xs font-semibold text-primary-content whitespace-nowrap shrink-0"
          >
            <span className="sm:hidden">{lang === 'ar' ? 'احجزي' : 'Book'}</span>
            <span className="hidden sm:inline">{copy.headerCta}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={lang === 'ar' ? 'القائمة' : 'Toggle menu'}
            aria-expanded={mobileMenuOpen}
            className="btn btn-ghost btn-sm btn-square lg:hidden text-primary shrink-0"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Clean Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-base-300 bg-base-100 px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-primary hover:bg-base-200"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReservations();
              }}
              className="mt-1 flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-primary hover:bg-base-200"
            >
              <span>{copy.myBookings}</span>
              <span className="tabular-nums text-secondary">({reservationsCount})</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

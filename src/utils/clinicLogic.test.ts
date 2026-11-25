import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWhatsAppUrl,
  CLINIC_LAT,
  CLINIC_LNG,
  CLINIC_MAPS_DIRECTIONS_URL,
  CLINIC_MAPS_EMBED_URL,
  CLINIC_MAPS_URL,
  computeClinicOpenStatus,
  generateBookingReference,
  getRecommendedWavelength,
  isValidJordanianPhone,
  normalizeJordanianPhone,
  validateBookingInput,
} from './clinicLogic';

test('buildWhatsAppUrl encodes English and Arabic booking messages properly', () => {
  const enUrl = buildWhatsAppUrl('Hello Grande Clinic, book full body laser');
  assert.equal(
    enUrl,
    'https://wa.me/962799191660?text=Hello%20Grande%20Clinic%2C%20book%20full%20body%20laser'
  );

  const arUrl = buildWhatsAppUrl('مرحباً جراند كلينك');
  assert.ok(arUrl.startsWith('https://wa.me/962799191660?text='));
  assert.equal(decodeURIComponent(arUrl.split('text=')[1]), 'مرحباً جراند كلينك');
});

test('Jordanian phone normalization and validation handles local and +962 formats', () => {
  assert.equal(normalizeJordanianPhone('+962 79 919 1660'), '0799191660');
  assert.equal(normalizeJordanianPhone('00962781234567'), '0781234567');
  assert.equal(isValidJordanianPhone('07 9919 1660'), true);
  assert.equal(isValidJordanianPhone('+962771234567'), true);
  assert.equal(isValidJordanianPhone('065551234'), false);
  assert.equal(isValidJordanianPhone('12345'), false);
});

test('validateBookingInput rejects incomplete fields and accepts valid reservations', () => {
  const invalid = validateBookingInput(
    {
      patientName: 'A',
      phone: '123',
      date: '',
      timeSlot: '22:00',
    },
    'en'
  );
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.patientName);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.serviceId);
  assert.ok(invalid.errors.specialistId);
  assert.ok(invalid.errors.date);
  assert.ok(invalid.errors.timeSlot);

  const valid = validateBookingInput(
    {
      patientName: 'Rania Al-Majali',
      phone: '07 9919 1660',
      serviceId: 'full-body',
      specialistId: 'dana',
      date: '2026-11-25',
      timeSlot: '10:30',
    },
    'en'
  );
  assert.equal(valid.valid, true);
  assert.equal(valid.normalizedPhone, '0799191660');
  assert.deepEqual(valid.errors, {});
});

test('getRecommendedWavelength maps Fitzpatrick phototypes safely', () => {
  const type2 = getRecommendedWavelength(2);
  assert.equal(type2.mode, 'alexandrite');
  assert.equal(type2.wavelengthNm, 755);

  const type5 = getRecommendedWavelength(5);
  assert.equal(type5.mode, 'ndyag');
  assert.equal(type5.wavelengthNm, 1064);
});

test('computeClinicOpenStatus checks daily 08:00-19:00 clinic hours accurately', () => {
  assert.equal(computeClinicOpenStatus(7, 59).isOpen, false);
  assert.equal(computeClinicOpenStatus(8, 0).isOpen, true);
  assert.equal(computeClinicOpenStatus(18, 30).isOpen, true);
  assert.equal(computeClinicOpenStatus(19, 0).isOpen, false);
});

test('generateBookingReference formats sequential Tabarbour codes', () => {
  assert.equal(generateBookingReference(1), 'GC-TAB-1001');
  assert.equal(generateBookingReference(42), 'GC-TAB-1042');
});

test('Google Business Profile coordinates and Maps links match verified Grande Clinic Tabarbour place', () => {
  assert.equal(CLINIC_LAT, 32.0030427);
  assert.equal(CLINIC_LNG, 35.9374969);
  assert.ok(CLINIC_MAPS_URL.includes('Grande+Clinic+Tabarbour'));
  assert.ok(CLINIC_MAPS_URL.includes('0x151b6104efac6569:0xad1f53926a6cfaef'));
  assert.ok(!CLINIC_MAPS_URL.includes('authuser='));
  assert.ok(CLINIC_MAPS_DIRECTIONS_URL.includes('32.0030427,35.9374969'));
  assert.ok(CLINIC_MAPS_EMBED_URL.includes('output=embed'));
});

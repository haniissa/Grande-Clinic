import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWhatsAppUrl,
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

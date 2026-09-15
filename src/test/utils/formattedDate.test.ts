import { describe, expect, it } from 'vitest';
import { formattedDate } from '@/utils/formattedDate';

describe('formattedDate', () => {
  it('should format a valid date with time by default', () => {
    const date = '2024-05-15T18:30:00Z';
    const expected = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(date));

    expect(formattedDate(date, { locale: 'en-US' })).toBe(expected);
  });

  it('should format a valid date without time when requested', () => {
    const date = '2024-05-15T18:30:00Z';
    const expected = new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'long',
    }).format(new Date(date));

    expect(formattedDate(date, { locale: 'es-ES', includeTime: false })).toBe(expected);
  });

  it('should return a fallback message for empty values', () => {
    expect(formattedDate(undefined)).toBe('Fecha no disponible');
    expect(formattedDate('')).toBe('Fecha no disponible');
  });

  it('should return a fallback message for invalid dates', () => {
    expect(formattedDate('fecha-invalida')).toBe('Fecha inválida');
  });
});

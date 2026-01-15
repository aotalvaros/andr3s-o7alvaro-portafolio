
interface FormattedDateOptions {
  locale?: string;
  includeTime?: boolean;
}

export const formattedDate = (
  dateString: string | null | undefined,
  options: FormattedDateOptions = {}
): string => {
  const { locale = navigator.language, includeTime = true } = options;

  if (!dateString) return 'Fecha no disponible';

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    console.error(`Invalid date provided to formattedDate: ${dateString}`);
    return 'Fecha inválida';
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
    ...(includeTime && { timeStyle: 'short' }),
  }).format(date);
};
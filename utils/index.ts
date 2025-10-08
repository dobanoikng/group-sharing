export const formatDate = (date: string, locale = 'vi') => {
  const formatter = new Intl.DateTimeFormat(locale);
  const unixTimeZero = Date.parse(date);
  return formatter.format(unixTimeZero)
}

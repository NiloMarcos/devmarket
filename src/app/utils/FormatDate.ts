export function formatDate(date: string) {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "";
  const formattedDate = parsedDate.toLocaleDateString("pt-BR");
  return formattedDate;
};

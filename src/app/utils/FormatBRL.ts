export function formatToCurrency(value: string) {
  const numericValue = parseFloat(value.replace(/[^\d]/g, "") || "0") / 100;
  return numericValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
};
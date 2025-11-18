// src/utils/formatters.js
export const formatCurrency = (amount) => {
  const num = Number(amount);
  // Guard: hindari NaN/undefined/null → tampilkan Rp 0
  const safe = Number.isFinite(num) ? num : 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(safe)
    .replace('IDR', 'Rp');
};

export const formatNumber = (number) => {
  const num = Number(number);
  return new Intl.NumberFormat('id-ID').format(Number.isFinite(num) ? num : 0);
};

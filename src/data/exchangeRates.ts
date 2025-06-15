
export const exchangeRates: { [key: string]: { [key: string]: number } } = {
  USD: { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 157.0, MXN: 18.4, CAD: 1.37 },
  EUR: { USD: 1.08, EUR: 1, GBP: 0.85, JPY: 170.0, MXN: 19.9, CAD: 1.48 },
  GBP: { USD: 1.27, EUR: 1.18, GBP: 1, JPY: 200.0, MXN: 23.4, CAD: 1.74 },
  JPY: { USD: 0.0064, EUR: 0.0059, GBP: 0.005, JPY: 1, MXN: 0.12, CAD: 0.0087 },
  MXN: { USD: 0.054, EUR: 0.05, GBP: 0.043, JPY: 8.5, MXN: 1, CAD: 0.074 },
  CAD: { USD: 0.73, EUR: 0.67, GBP: 0.57, JPY: 114.0, MXN: 13.4, CAD: 1 },
};

export const supportedCurrencies = [
  { code: 'USD', name: 'United States Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound Sterling', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
];

export const ALL_CURRENCIES = ["EUR", "USD", "SEK", "JPY", "GBP"] as const;
export type Currency = typeof ALL_CURRENCIES[number];

export const RANGES = {
  "1 Day": 1,
  "1 Week": 7,
  "1 Month": 30,
  "6 Months": 180,
  "1 Year": 365,
} as const;
export type Range = keyof typeof RANGES;

export type RateData = {
  date: string;
  [key: string]: number | string;
};

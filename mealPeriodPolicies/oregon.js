export const oregonPolicy = {
  mealPeriodDuration: 30,
  mealPeriodThresholds: [
    { threshold: 6, mealPeriods: 1 },
    { threshold: 14, mealPeriods: 2 },
    { threshold: 22, mealPeriods: 3 },
  ],
  waivable: false,
};

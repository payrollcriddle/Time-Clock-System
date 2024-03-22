// mealPeriodPolicies.js

const mealPeriodPolicies = {
  California: {
    mealPeriodDuration: 30,
    mealPeriodThreshold: 5,
    secondMealPeriodThreshold: 10,
    maxHoursWithoutSecondMealPeriod: 12,
    waivable: true,
  },
  Montana: {
    mealPeriodDuration: 30,
    waivable: false,
  },
  Nevada: {
    mealPeriodDuration: 30,
    mealPeriodThreshold: 8,
    waivable: true,
  },
  Oregon: {
    mealPeriodDuration: 30,
    mealPeriodThresholds: [
      { threshold: 6, mealPeriods: 1 },
      { threshold: 14, mealPeriods: 2 },
      { threshold: 22, mealPeriods: 3 },
    ],
    waivable: false,
  },
  Washington: {
    mealPeriodDuration: 30,
    mealPeriodThreshold: 5,
    overtimeMealPeriodThreshold: 3,
    waivable: true,
  },
  Colorado: {
    mealPeriodDuration: 30,
    mealPeriodThreshold: 5,
    uninterrupted: true,
    dutyFree: true,
    canBeUnpaid: true,
  },
};

export default mealPeriodPolicies;

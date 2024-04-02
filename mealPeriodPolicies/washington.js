import { calculateTotalHours } from './mealPeriodPolicyUtils.js';

export const washingtonPolicy = {
  mealPeriodDuration: 30,
  mealPeriodThreshold: 5,
  overtimeMealPeriodThreshold: 3,
  waivable: true,

  shouldPromptForMealPeriodWaiver: function(dailyTimecard) {
    const totalHours = calculateTotalHours(dailyTimecard);

    if (totalHours > this.mealPeriodThreshold) {
      const hasTakenMealPeriod = dailyTimecard.some(entry => entry.activityTypeId === 'meal');

      if (!hasTakenMealPeriod) {
        return true;
      }
    }

    return false;
  }
};

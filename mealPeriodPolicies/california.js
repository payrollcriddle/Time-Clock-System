import { calculateTotalHours } from './mealPeriodPolicyUtils.js';

export const californiaPolicy = {
  mealPeriodDuration: 30,
  mealPeriodThreshold: 5,
  secondMealPeriodThreshold: 10,
  maxHoursWithoutSecondMealPeriod: 12,
  waivable: true,

  shouldPromptForMealPeriodWaiver: function(dailyTimecard) {
    const totalHours = calculateTotalHours(dailyTimecard);

    if (totalHours > this.mealPeriodThreshold && totalHours <= this.secondMealPeriodThreshold) {
      const hasTakenMealPeriod = dailyTimecard.some(entry => entry.activityTypeId === 'meal');

      if (!hasTakenMealPeriod) {
        return true;
      }
    } else if (totalHours > this.secondMealPeriodThreshold && totalHours <= this.maxHoursWithoutSecondMealPeriod) {
      const mealPeriodCount = dailyTimecard.filter(entry => entry.activityTypeId === 'meal').length;

      if (mealPeriodCount < 2) {
        return true;
      }
    }

    return false;
  }
};

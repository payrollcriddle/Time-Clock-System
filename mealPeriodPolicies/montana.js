export const montanaPolicy = {
  mealPeriodDuration: 30,
  waivable: false,

  shouldPromptForMealPeriodWaiver: function(dailyTimecard) {
    return false; // Meal periods are not waivable in Montana
  }
};

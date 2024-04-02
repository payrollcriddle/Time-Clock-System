export const coloradoPolicy = {
  mealPeriodDuration: 30,
  mealPeriodThreshold: 5,
  uninterrupted: true,
  dutyFree: true,
  canBeUnpaid: true,

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

function calculateTotalHours(dailyTimecard) {
  // ... (same as in california.js)
}

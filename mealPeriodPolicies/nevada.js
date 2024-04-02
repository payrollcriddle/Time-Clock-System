export const nevadaPolicy = {
  mealPeriodDuration: 30,
  mealPeriodThreshold: 8,
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

function calculateTotalHours(dailyTimecard) {
  let totalHours = 0;
  
  for (let i = 0; i < dailyTimecard.length; i++) {
    const entry = dailyTimecard[i];
    
    if (entry.activityTypeId !== 'meal') {
      const startTime = new Date(entry.startTime);
      const endTime = entry.endTime ? new Date(entry.endTime) : new Date(); // Use current time if no end time
      
      const duration = (endTime - startTime) / 3600000; // Convert milliseconds to hours
      totalHours += duration;
    }
  }
  
  return totalHours;
}

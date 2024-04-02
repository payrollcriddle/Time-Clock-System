// mealPeriodPolicies/california.js

export const californiaPolicy = {
  mealPeriodDuration: 30,
  mealPeriodThreshold: 5,
  secondMealPeriodThreshold: 10,
  maxHoursWithoutSecondMealPeriod: 12,
  waivable: true,
  
  shouldPromptForMealPeriodWaiver: function(dailyTimecard) {
    const totalHours = calculateTotalHours(dailyTimecard);
    
    if (totalHours > this.mealPeriodThreshold && totalHours <= this.secondMealPeriodThreshold) {
      // Check if the employee took a meal period
      const hasTakenMealPeriod = dailyTimecard.some(entry => entry.activityTypeId === 'meal');
      
      if (!hasTakenMealPeriod) {
        return true; // Prompt for meal period waiver
      }
    } else if (totalHours > this.secondMealPeriodThreshold && totalHours <= this.maxHoursWithoutSecondMealPeriod) {
      // Check if the employee took two meal periods
      const mealPeriodCount = dailyTimecard.filter(entry => entry.activityTypeId === 'meal').length;
      
      if (mealPeriodCount < 2) {
        return true; // Prompt for meal period waiver
      }
    }
    
    return false; // No need to prompt for meal period waiver
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

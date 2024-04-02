export const oregonPolicy = {
  mealPeriodDuration: 30,
  mealPeriodThresholds: [
    { threshold: 6, mealPeriods: 1 },
    { threshold: 14, mealPeriods: 2 },
    { threshold: 22, mealPeriods: 3 },
  ],
  waivable: false,

  shouldPromptForMealPeriodWaiver: function(dailyTimecard) {
    const totalHours = calculateTotalHours(dailyTimecard);
    
    for (let i = 0; i < this.mealPeriodThresholds.length; i++) {
      const { threshold, mealPeriods } = this.mealPeriodThresholds[i];
      
      if (totalHours > threshold) {
        const takenMealPeriodCount = dailyTimecard.filter(entry => entry.activityTypeId === 'meal').length;
        
        if (takenMealPeriodCount < mealPeriods) {
          return true;
        }
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

export function getMealPeriodPolicy(state) {
  try {
    const policyModule = import(`./${state}.js`);
    return policyModule.default;
  } catch (error) {
    console.error(`Meal period policy not found for state: ${state}`);
    return null;
  }
}

export function calculateTotalHours(dailyTimecard) {
  let totalHours = 0;

  for (let i = 0; i < dailyTimecard.length; i++) {
    const entry = dailyTimecard[i];

    if (entry.activityTypeId !== 'meal') {
      const startTime = new Date(entry.startTime);
      const endTime = entry.endTime ? new Date(entry.endTime) : new Date();

      const duration = (endTime - startTime) / 3600000;
      totalHours += duration;
    }
  }

  return totalHours;
}

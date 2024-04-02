export function getMealPeriodPolicy(state) {
  try {
    const policyModule = import(`./${state}.js`);
    return policyModule.default;
  } catch (error) {
    console.error(`Meal period policy not found for state: ${state}`);
    return null;
  }
}

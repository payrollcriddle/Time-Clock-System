// mealPeriodPolicies.js

import { getStateConfig } from './stateConfig.js';

const mealPeriodPolicies = {};

function loadMealPeriodPolicy(state) {
    const stateConfig = getStateConfig(state);
    if (stateConfig && stateConfig.policyFile) {
        try {
            const policyModule = await import(`./mealPeriodPolicies/${stateConfig.policyFile}`);
            mealPeriodPolicies[state] = policyModule.default;
        } catch (error) {
            console.error(`Error loading meal period policy for state: ${state}`, error);
        }
    }
}

export async function getMealPeriodPolicy(state) {
    if (!mealPeriodPolicies[state]) {
        await loadMealPeriodPolicy(state);
    }
    return mealPeriodPolicies[state] || null;
}

export async function getAllMealPeriodPolicies() {
    const states = Object.keys(getStateConfig());
    await Promise.all(states.map(loadMealPeriodPolicy));
    return states.reduce((policies, state) => {
        policies[state] = mealPeriodPolicies[state];
        return policies;
    }, {});
}

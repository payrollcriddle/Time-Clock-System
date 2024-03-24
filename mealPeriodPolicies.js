import { californiaPolicy } from './mealPeriodPolicies/california.js';
import { montanaPolicy } from './mealPeriodPolicies/montana.js';
import { nevadaPolicy } from './mealPeriodPolicies/nevada.js';
import { oregonPolicy } from './mealPeriodPolicies/oregon.js';
import { washingtonPolicy } from './mealPeriodPolicies/washington.js';
import { coloradoPolicy } from './mealPeriodPolicies/colorado.js';

const mealPeriodPolicies = {
  California: californiaPolicy,
  Montana: montanaPolicy,
  Nevada: nevadaPolicy,
  Oregon: oregonPolicy,
  Washington: washingtonPolicy,
  Colorado: coloradoPolicy,
};

export default mealPeriodPolicies;

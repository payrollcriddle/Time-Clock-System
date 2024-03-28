// activityTypeManagement.js

// Simulate activity type data retrieval from a database or API
let activityTypes = [
  { id: 1, name: 'Activity 1' },
  { id: 2, name: 'Activity 2' },
  { id: 3, name: 'Activity 3' },
];

// Function to get all activity types
export function getActivityTypes() {
  // Retrieve activity types from the database or data store
  return activityTypes;
}

// Function to add a new activity type
export function addActivityType(activityType) {
  // Add activity type to the database or data store
  activityTypes.push(activityType);
}

// Function to delete an activity type
export function deleteActivityType(activityTypeId) {
  // Delete activity type from the database or data store
  activityTypes = activityTypes.filter(activityType => activityType.id !== activityTypeId);
}

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

// Function to create a new activity type
export function createActivityType(activityTypeData) {
  // Validate activity type data
  if (!activityTypeData.name) {
    throw new Error('Activity type name is required');
  }

  // Create a new activity type and add it to the database or data store
  const newActivityType = { id: generateActivityTypeId(), ...activityTypeData };
  activityTypes.push(newActivityType);
  return newActivityType;
}

// Function to update an activity type
export function updateActivityType(activityTypeId, updatedActivityTypeData) {
  // Find the activity type by id and update its properties
  const index = activityTypes.findIndex(activityType => activityType.id === activityTypeId);
  if (index !== -1) {
    activityTypes[index] = { ...activityTypes[index], ...updatedActivityTypeData };
    return activityTypes[index];
  }
  return null;
}

// Function to generate a unique activity type ID
function generateActivityTypeId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}


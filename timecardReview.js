import { getTimecard, updateTimecard } from './timecard.js';
import { sendNotification } from './teamsNotification.js';
import { getUserById } from './userData.js';
import { logTimecardReviewAction } from './logging.js';

// Function to review a timecard
export async function reviewTimecard(timecardId, reviewerId) {
  try {
    // Retrieve timecard data for review
    const timecard = await getTimecard(timecardId);

    if (!timecard) {
      throw new Error('Timecard not found');
    }

    // Perform validation and checks on the timecard data
    const isValid = validateTimecard(timecard);

    if (!isValid) {
      throw new Error('Timecard validation failed');
    }

    // Log the review action
    await logTimecardReviewAction(timecardId, reviewerId, 'reviewed');

    // Return the reviewed timecard data
    return timecard;
  } catch (error) {
    console.error('Error reviewing timecard:', error);
    throw error;
  }
}

// Function to approve a timecard
export async function approveTimecard(timecardId, approverId) {
  try {
    // Retrieve timecard data
    const timecard = await getTimecard(timecardId);

    if (!timecard) {
      throw new Error('Timecard not found');
    }

    // Update timecard status to approved
    timecard.status = 'approved';

    // Update the timecard data in the database or data store
    await updateTimecard(timecard);

    // Send notification to the employee
    const employee = await getUserById(timecard.employeeId);
    await sendNotification(employee.email, 'Timecard Approved', 'Your timecard has been approved.');

    // Log the approval action
    await logTimecardReviewAction(timecardId, approverId, 'approved');

    // Return the approved timecard
    return timecard;
  } catch (error) {
    console.error('Error approving timecard:', error);
    throw error;
  }
}

// Function to reject a timecard
export async function rejectTimecard(timecardId, rejectionReason, rejecterId) {
  try {
    // Retrieve timecard data
    const timecard = await getTimecard(timecardId);

    if (!timecard) {
      throw new Error('Timecard not found');
    }

    // Update timecard status to rejected
    timecard.status = 'rejected';

    // Add the rejection reason to the timecard
    timecard.rejectionReason = rejectionReason;

    // Update the timecard data in the database or data store
    await updateTimecard(timecard);

    // Send notification to the employee
    const employee = await getUserById(timecard.employeeId);
    await sendNotification(employee.email, 'Timecard Rejected', `Your timecard has been rejected. Reason: ${rejectionReason}`);

    // Log the rejection action
    await logTimecardReviewAction(timecardId, rejecterId, 'rejected', rejectionReason);

    // Return the rejected timecard
    return timecard;
  } catch (error) {
    console.error('Error rejecting timecard:', error);
    throw error;
  }
}

// Function to validate timecard data
function validateTimecard(timecard) {
  // Perform validation checks on the timecard data
  // Return true if the timecard is valid, false otherwise
  // Add your specific validation logic here
  // Example checks:
  // - Check if all required fields are present
  // - Check for any inconsistencies or anomalies in the data
  // - Ensure compliance with business rules or regulations
  // ...

  // Placeholder validation logic
  return true;
}

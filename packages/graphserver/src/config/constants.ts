
// Get today's date
const today = new Date();

// Subtract seven days
export const SEVEN_DAYS_AGO = new Date(today.setDate(today.getDate() - 7)).toISOString();
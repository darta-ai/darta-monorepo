
    // Get today's date
    const today = new Date();

    // Subtract 14 days
    export const FOURTEEN_DAYS_AGO = new Date(today.setDate(today.getDate() - 14)).toISOString();
/**
 * Format the given date into a human-readable string.
 *
 * @param {Date} date
 * @returns {string} A human-readable string representing the given date.
 */
const humanReadableDate = ( date : Date ) => {
    return date.toLocaleString("en-US", {
      weekday: "long", // e.g., "Wednesday"
      year: "numeric", // e.g., 2025
      month: "long", // e.g., "February"
      day: "numeric", // e.g., 19
      hour: "numeric", // e.g., 12 AM
      minute: "numeric",
      second: "numeric",
      hour12: true, // for AM/PM format
    });
}

export default humanReadableDate
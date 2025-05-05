// Utility function to generate the days of the current month
const generateCalendarDays = (year: number, month: number) => {
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const days: Date[] = [];
  
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
  
    return days;
  };
  
  // Utility function to get the day of the week for the first date of the month
  const getFirstDayOfMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    return firstDay.getDay(); // Sunday = 0, Monday = 1, etc.
  };

    // Format month name
    const formatMonth = (month: number) => {
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        return months[month];
      };

  export { generateCalendarDays, getFirstDayOfMonth, formatMonth };
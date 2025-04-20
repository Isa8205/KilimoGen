function generateCode() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Month (01-12)
    const day = now.getDate().toString().padStart(2, "0"); // Day (01-31)
    const hours = now.getHours().toString().padStart(2, "0"); // Hours (00-23)
    const minutes = now.getMinutes().toString().padStart(2, "0"); // Minutes (00-59)
    const seconds = now.getSeconds().toString().padStart(2, "0"); // Seconds (00-59)
  
    // Combine date parts into a string
    const dateTimeString = `${year}${month}${day}${hours}${minutes}${seconds}`;
  
    // Convert to base36 (numbers + letters)
    const base36Code = parseInt(dateTimeString, 10).toString(36).toUpperCase();
  
    // Ensure it is 8 characters long
    return base36Code.padStart(8, "X"); // Padding with 'X' if needed
  }
  
  function decodeCode(code: string) {
    // Convert base36 back to integer
    const dateTimeNumber = parseInt(code, 36);
  
    // Convert back to string and pad missing zeros
    const dateTimeString = dateTimeNumber.toString().padStart(12, "0");
  
    // Extract date components
    const year = "20" + dateTimeString.slice(0, 2); // Assuming 20XX format
    const month = dateTimeString.slice(2, 4);
    const day = dateTimeString.slice(4, 6);
    const hours = dateTimeString.slice(6, 8);
    const minutes = dateTimeString.slice(8, 10);
    const seconds = dateTimeString.slice(10, 12);
  
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
  }  

  export default generateCode;
  export {decodeCode};
  
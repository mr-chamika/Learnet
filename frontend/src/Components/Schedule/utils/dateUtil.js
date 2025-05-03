
function format(date, formatStr, options = {}) {
  // Parse the date input into a Date object
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date provided");
  }

  const { locale = "en-US", timeZone } = options;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

 /* const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { month: "long", timeZone }).format(new Date(0, i))
  );*/

  // Handle common format tokens
  const replacements = {
    yyyy: parsedDate.getFullYear().toString(),
    MM: String(parsedDate.getMonth() + 1).padStart(2, "0"),
    dd: String(parsedDate.getDate()).padStart(2, "0"),
    HH: String(parsedDate.getHours()).padStart(2, "0"),
    mm: String(parsedDate.getMinutes()).padStart(2, "0"),
    ss: String(parsedDate.getSeconds()).padStart(2, "0"),
    MMMM: monthNames[parsedDate.getMonth()],
  };

  // Replace tokens in the format string
  let formattedDate = formatStr;
  for (const [token, value] of Object.entries(replacements)) {
    const tokenRegex = new RegExp(`\\b${token}\\b`, "g");
    formattedDate = formattedDate.replace(tokenRegex, value);
  }

  

  return formattedDate;
}

function startOfMonth(date) {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date provided");
  }
  return new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1);
}

function endOfMonth(date) {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date provided");
  }
  return new Date(parsedDate.getFullYear(), parsedDate.getMonth() + 1, 0);
}

function eachDayOfInterval({ start, end }) {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error("Invalid start or end date provided");
  }

  if (startDate > endDate) {
    throw new Error("Start date must be before or equal to end date");
  }

  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate)); // Add a copy of the current date
    currentDate.setDate(currentDate.getDate() + 1); // Increment by one day
  }

  return dates;
}


module.exports = { format, startOfMonth, endOfMonth, eachDayOfInterval };






/*
// Optionally adjust for locale and time zone using Intl.DateTimeFormat
  if (locale || timeZone) {
    const formatter = new Intl.DateTimeFormat(locale, {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    formattedDate = formatter.format(parsedDate);
  }

/**
 * Formats a date into a string based on a given format string.
 * @param {string | number | Date} date - The date to format. Can be a Date object, a timestamp, or a date string.
 * @param {string} formatStr - The format string. Supports common tokens like "yyyy-MM-dd".
 * @param {Object} [options] - Optional settings for locale and time zone.
 * @param {string} [options.locale] - Locale string, e.g., "en-US".
 * @param {string} [options.timeZone] - Time zone string, e.g., "UTC".
 * @returns {string} The formatted date string.
 

export interface FormatOptions {
    locale?: string; // e.g., "en-US", "fr-FR"
    timeZone?: string; // e.g., "UTC", "America/New_York"
  }
  
  export function format(
    date: string | number | Date,
    formatStr: string,
    options?: FormatOptions
  ): string {
    // Parse the date input into a Date object
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date provided");
    }
  
    const { locale = "en-US", timeZone } = options || {};
  
    // Handle common format tokens
    const replacements: Record<string, string> = {
      yyyy: parsedDate.getFullYear().toString(),
      MM: String(parsedDate.getMonth() + 1).padStart(2, "0"),
      dd: String(parsedDate.getDate()).padStart(2, "0"),
      HH: String(parsedDate.getHours()).padStart(2, "0"),
      mm: String(parsedDate.getMinutes()).padStart(2, "0"),
      ss: String(parsedDate.getSeconds()).padStart(2, "0"),
    };
  
    // Replace tokens in the format string
    let formattedDate = formatStr;
    for (const [token, value] of Object.entries(replacements)) {
      formattedDate = formattedDate.replace(token, value);
    }
  
    // Optionally adjust for locale and time zone using Intl.DateTimeFormat
    if (locale || timeZone) {
      const formatter = new Intl.DateTimeFormat(locale, {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
  
      formattedDate = formatter.format(parsedDate);
    }
  
    return formattedDate;
  }
  */
interface ParsedTime {
  hours: number;
  minutes: number;
}

interface Slots {
  start: string;
  end: string;
}

/**
 * Parses a time string in 12-hour format (e.g., "09:00 AM") into hours and minutes
 * @param time - Time string in format "HH:MM AM/PM"
 * @returns ParsedTime object containing hours (in 24-hour format) and minutes
 * @example
 * parseTime("09:00 AM") // returns { hours: 9, minutes: 0 }
 * parseTime("09:00 PM") // returns { hours: 21, minutes: 0 }
 */
export const parseTime = (time: string) => {
  const [timePart, period] = time.split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return { hours, minutes };
};

/**
 * Generates available time slots based on opening hours and meeting parameters
 * @param openingTime - Business opening time in "HH:MM AM/PM" format
 * @param closingTime - Business closing time in "HH:MM AM/PM" format
 * @param meetingDuration - Duration of each meeting in minutes
 * @param breakBefore - Required break time before each meeting in minutes
 * @param breakAfter - Required break time after each meeting in minutes
 * @returns Array of time slots, each containing start and end times in 12-hour format
 * @example
 * getTimeSlots("09:00 AM", "05:00 PM", 60, 15, 15)
 * // returns [
 * //   { start: "09:15 AM", end: "10:15 AM" },
 * //   { start: "10:30 AM", end: "11:30 AM" },
 * //   ...
 * // ]
 */
export function getTimeSlots(
  openingTime: string,
  closingTime: string,
  meetingDuration: number,
  breakBefore: number,
  breakAfter: number
) {
  const formatTime = ({ hours, minutes }: ParsedTime) => {
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  const addMinutes = (time: ParsedTime, minutesToAdd: number) => {
    let hours = time.hours
    let minutes = time.minutes

    minutes += minutesToAdd;
    while (minutes >= 60) {
      minutes -= 60;
      hours += 1;
    }
    return { hours, minutes };
  };

  const opening = parseTime(openingTime);
  const closing = parseTime(closingTime);
  const slots: Slots[] = [];

  let currentTime = opening;

  while (true) {
    const startSlot = addMinutes(currentTime, breakBefore);
    const endSlot = addMinutes(startSlot, meetingDuration);
    const nextStartTime = addMinutes(endSlot, breakAfter);

    if (endSlot.hours > closing.hours || (endSlot.hours > closing.hours && endSlot.minutes > closing.minutes)) {
      break;
    }

    slots.push({ start: formatTime(startSlot), end: formatTime(endSlot) });
    currentTime = nextStartTime;
  }

  return slots;
}

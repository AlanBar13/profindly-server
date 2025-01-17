interface ParsedTime {
  hours: number;
  minutes: number;
}

interface Slots {
  start: string;
  end: string;
}

export function getTimeSlots(
  openingTime: string,
  closingTime: string,
  meetingDuration: number,
  breakBefore: number,
  breakAfter: number
) {
  const parseTime = (time: string) => {
    const [timePart, period] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
  };

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

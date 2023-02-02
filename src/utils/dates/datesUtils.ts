import { JOURS } from "./frenchDateNames";

export const getDateXDaysAgo = (daysAgo: number): Date => {
  const now = new Date();

  const targetDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  targetDate.setUTCHours(0, 0, 0, 0);

  return targetDate;
};

interface periodInfos {
  start: Date;
  end: Date;
  name: string;
}

export const getDateXDaysAgoDaysInfos = (daysAgo: number): periodInfos[] => {
  const now = new Date();

  const lastXDaysInfos: periodInfos[] = [];
  // daysAgo - 1 to include currentDay
  const oldestDate = new Date(
    now.getTime() - (daysAgo - 1) * 24 * 60 * 60 * 1000
  );

  for (let i = 0; i < daysAgo; i++) {
    const baseDateMS = oldestDate.getTime();
    const newDayDate = baseDateMS + i * 3600 * 24 * 1000;
    const date = new Date(newDayDate);
    const dayFrench = JOURS[date.getDay()];

    const dayInfos = {
      start: new Date(date.setUTCHours(0, 0, 0, 0)),
      end: new Date(date.setUTCHours(23, 59, 59, 999)),
      name: dayFrench,
    };
    lastXDaysInfos.push(dayInfos);
  }

  return lastXDaysInfos;
};

export const getDateXWeeksAgoInfos = (weeksAgo: number): periodInfos[] => {
  const now = new Date();

  const lastXWeeksInfos: periodInfos[] = [];
  const oldestDate = new Date(
    now.getTime() - weeksAgo * 7 * 24 * 60 * 60 * 1000
  );

  for (let i = 0; i < weeksAgo * 7; i += 7) {
    const baseDateMS = oldestDate.getTime();
    const newDayDate = baseDateMS + i * 3600 * 24 * 1000;
    const date = new Date(newDayDate);

    const name =
      weeksAgo * 7 - i === 7
        ? "Cette semaine"
        : weeksAgo * 7 - i === 14
        ? "Il y a une semaine"
        : `Il y a ${(weeksAgo * 7 - i) / 7 - 1} semaines`;

    const startOfTheWeekDate = new Date(date.setUTCHours(0, 0, 0, 0));
    const endOfFirstWeekDayDate = new Date(date.setUTCHours(23, 59, 59, 999));
    const endOfTheWeekDate = new Date(
      endOfFirstWeekDayDate.setDate(endOfFirstWeekDayDate.getDate() + 7)
    );

    const dayInfos = {
      start: startOfTheWeekDate,
      end: endOfTheWeekDate,
      name,
    };

    lastXWeeksInfos.push(dayInfos);
  }

  return lastXWeeksInfos;
};

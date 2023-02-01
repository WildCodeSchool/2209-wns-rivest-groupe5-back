import { JOURS } from "./frenchDateNames";

export const getDateXDaysAgo = (daysAgo: number): Date => {
  const now = new Date();

  const targetDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  targetDate.setUTCHours(0, 0, 0, 0);

  return targetDate;
};

interface dayInfos {
  start: Date;
  end: Date;
  name: string;
}

export const getDateXDaysAgoDaysInfos = (daysAgo: number): dayInfos[] => {
  const now = new Date();

  const lastXDaysInfos: dayInfos[] = [];
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

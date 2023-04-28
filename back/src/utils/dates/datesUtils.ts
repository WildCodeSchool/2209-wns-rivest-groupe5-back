import { IPeriodInfos } from '../../interfaces/general/IPeriodInfos'
import { JOURS, MOIS } from './frenchDateNames'

export const getDateXDaysAgo = (daysAgo: number): Date => {
  const now = new Date()

  const targetDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000)
  targetDate.setUTCHours(0, 0, 0, 0)

  return targetDate
}

export const getDateXDaysAgoDaysInfos = (daysAgo: number): IPeriodInfos[] => {
  const now = new Date()

  const lastXDaysInfos: IPeriodInfos[] = []
  // daysAgo - 1 to include currentDay
  const oldestDate = new Date(
    now.getTime() - (daysAgo - 1) * 24 * 60 * 60 * 1000
  )

  for (let i = 0; i < daysAgo; i++) {
    const baseDateMS = oldestDate.getTime()
    const newDayDate = baseDateMS + i * 3600 * 24 * 1000
    const date = new Date(newDayDate)
    const dayFrench = JOURS[date.getDay()]

    const dayInfos = {
      start: new Date(date.setUTCHours(0, 0, 0, 0)),
      end: new Date(date.setUTCHours(23, 59, 59, 999)),
      name: dayFrench,
    }
    lastXDaysInfos.push(dayInfos)
  }

  return lastXDaysInfos
}

export const getDateXWeeksAgoInfos = (weeksAgo: number): IPeriodInfos[] => {
  const now = new Date()

  const lastXWeeksInfos: IPeriodInfos[] = []

  // go back X weeks ago
  const oldestDate = new Date(
    now.getTime() - (weeksAgo - 1) * 7 * 24 * 60 * 60 * 1000
  )

  // get day of the week
  const day = oldestDate.getDay()

  // get diff between day of month and day of week (-6 if sunday to return to monday, otherwise +1)
  const diff = oldestDate.getDate() - day + (day === 0 ? -6 : 1)

  const startOfOldestDate = new Date(
    new Date(oldestDate.setDate(diff)).setUTCHours(0, 0, 0, 0)
  )

  for (let i = 0; i < weeksAgo; i++) {
    const startOfOldestCopy = new Date(startOfOldestDate)

    const currWeekDateBegin = new Date(
      startOfOldestCopy.setDate(startOfOldestCopy.getDate() + i * 7)
    )

    const currWeekLastDay = new Date(currWeekDateBegin)
    currWeekLastDay.setDate(currWeekLastDay.getDate() + 6)
    currWeekLastDay.setUTCHours(23, 59, 59, 999)

    const name =
      i === weeksAgo - 1
        ? 'Cette semaine'
        : i === weeksAgo - 2
        ? 'Il y a une semaine'
        : `Il y a ${weeksAgo - i - 1} semaines`

    const dayInfos = {
      start: startOfOldestCopy,
      end: currWeekLastDay,
      name,
    }

    lastXWeeksInfos.push(dayInfos)
  }

  return lastXWeeksInfos
}

export const getDateXMonthsAgoInfos = (monthsAgo: number): IPeriodInfos[] => {
  const now = new Date()

  const lastXMonthsInfos: IPeriodInfos[] = []

  const oldestMonthsAgoDate = new Date(
    now.setMonth(now.getMonth() - (monthsAgo - 1))
  )

  const startOfTheOldestMonth = new Date(
    oldestMonthsAgoDate.getUTCFullYear(),
    oldestMonthsAgoDate.getUTCMonth(),
    1
  )

  for (let i = 0; i < monthsAgo; i++) {
    const startOfOldestCopy = new Date(startOfTheOldestMonth) // don't mutate original value

    const monthDateBegin = new Date(
      startOfOldestCopy.setMonth(startOfOldestCopy.getMonth() + i)
    )
    const startOfMonth = new Date(monthDateBegin.setUTCHours(0, 0, 0, 0))

    const endOfCurrentMonth = new Date(
      monthDateBegin.getUTCFullYear(),
      monthDateBegin.getUTCMonth() + 1,
      0
    )

    const endOfMonth = new Date(endOfCurrentMonth.setUTCHours(23, 59, 59, 999))

    const currentMonthFrenchName = MOIS[monthDateBegin.getMonth()]

    const monthInfos = {
      start: startOfMonth,
      end: endOfMonth,
      name: currentMonthFrenchName,
    }

    lastXMonthsInfos.push(monthInfos)
  }

  return lastXMonthsInfos
}

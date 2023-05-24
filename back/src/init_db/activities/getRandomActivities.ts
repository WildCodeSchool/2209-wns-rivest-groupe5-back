import { DeepPartial } from 'typeorm'
import getRandomNumberBetween from '../utils/getRandomNumberBetween'
import getActivitylInfos from './getActivityInfos'
import getRandomElement from '../utils/getRandomElementFromArray'
import getActivityTypes from './getActivityTypes'
import { User } from '../../entities/user'
import { Activity } from '../../entities/activity'

const getRandomActivities = ({
  users,
}: {
  users: User[]
}): DeepPartial<Activity>[] => {
  const allActivities: DeepPartial<Activity>[] = []

  users.forEach((user) => {
    const activitiesAmount = getRandomNumberBetween(3, 15)
    for (let index = 0; index < activitiesAmount; index++) {
      const activityType = getRandomElement(getActivityTypes())

      const activity = getActivitylInfos({
        titleWordsLength: getRandomNumberBetween(3, 12),
        descriptionWordsLength: getRandomNumberBetween(10, 200),
        activityType,
        user,
      })

      allActivities.push(activity)
    }
  })

  return allActivities
}

export default getRandomActivities

import { DeepPartial } from 'typeorm'
import getIpsumText from '../utils/getIpsumText'
import { getRandomActivityDate } from '../utils/getRandomActivityDate'
import getRandomNumberBetween from '../utils/getRandomNumberBetween'
import { ActivityType } from '../../entities/activityType'
import { User } from '../../entities/user'
import { Activity } from '../../entities/activity'

const getActivitylInfos = ({
  titleWordsLength,
  descriptionWordsLength,
  user,
  activityType,
}: {
  titleWordsLength: number
  descriptionWordsLength: number
  user: User
  activityType: DeepPartial<ActivityType>
}): DeepPartial<Activity> => {
  return {
    activityType,
    activityDate: getRandomActivityDate(),
    carbonQuantity: getRandomNumberBetween(500, 1000000),
    title: getIpsumText(titleWordsLength),
    description: getIpsumText(descriptionWordsLength),
    user,
  }
}

export default getActivitylInfos

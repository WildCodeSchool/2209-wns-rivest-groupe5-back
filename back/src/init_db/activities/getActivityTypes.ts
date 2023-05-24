import { DeepPartial } from 'typeorm'
import {
  activityTypeLabel,
  activityTypeName,
} from '../../interfaces/entities/ActivityTypesTypesValues'
import { ActivityType } from '../../entities/activityType'

const getActivityTypes = (): DeepPartial<ActivityType>[] => {
  return [
    {
      activityTypeId: 1,
      backgroundColor: '#f9ca24',
      emoji: '🚗',
      label: activityTypeLabel.Transport,
      name: activityTypeName.transport,
    },
    {
      activityTypeId: 2,
      backgroundColor: '#f0932b',
      emoji: '💻',
      label: activityTypeLabel.Numerique,
      name: activityTypeName.numeric,
    },
    {
      activityTypeId: 3,
      backgroundColor: '#eb4d4b',
      emoji: '🍕',
      label: activityTypeLabel.Alimentation,
      name: activityTypeName.food,
    },
    {
      activityTypeId: 4,
      backgroundColor: '#6ab04c',
      emoji: '⚡',
      label: activityTypeLabel.Energie,
      name: activityTypeName.energy,
    },
    {
      activityTypeId: 5,
      backgroundColor: '#7ed6df',
      emoji: '🚿',
      label: activityTypeLabel.Electromenager,
      name: activityTypeName.appliance,
    },
    {
      activityTypeId: 6,
      backgroundColor: '#686de0',
      emoji: '🤷‍♂️',
      label: activityTypeLabel.Autre,
      name: activityTypeName.other,
    },
  ]
}

export default getActivityTypes

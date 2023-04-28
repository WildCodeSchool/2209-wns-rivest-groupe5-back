import { activityTypeLabel, activityTypeName } from './ActivityTypesTypesValues'

export interface IActivityType {
  activityTypeId: number
  name: activityTypeName
  label: activityTypeLabel
  emoji?: string
  backgroundColor: string
}

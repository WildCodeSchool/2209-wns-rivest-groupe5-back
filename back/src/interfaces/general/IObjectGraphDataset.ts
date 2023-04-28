import {
  activityTypeLabel,
  activityTypeName,
} from '../entities/ActivityTypesTypesValues'

export interface IObjectGraphDataset {
  labels: string[]
  datasets: IGraphDataset[]
}

export interface IGraphDataset {
  id?: number
  name?: activityTypeName
  label?: activityTypeLabel
  emoji?: string | string[]
  backgroundColor: string | string[]
  data: number[]
}

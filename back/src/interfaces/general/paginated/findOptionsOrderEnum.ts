import { registerEnumType } from 'type-graphql'

export enum FindOptionsOrderValue {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(FindOptionsOrderValue, {
  name: 'FindOptionsOrderValue',
})

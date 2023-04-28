import { DeepPartial } from 'typeorm'
import { GoodDeal } from '../../src/entities/goodDeal'
import { User } from '../../src/entities/user'
import getGoodDealInfos from './getGoodDealInfos'
import getRandomNumberBetween from './getRandomNumberBetween'
import getRandomElement from '../utils/getRandomElementFromArray'

const getRandomGoodDeals = ({
  users,
  amountToGenerate,
}: {
  users: User[]
  amountToGenerate: number
}): DeepPartial<GoodDeal>[] => {
  const allGoodDeals: DeepPartial<GoodDeal>[] = []

  for (let index = 0; index < amountToGenerate; index++) {
    const gd = getGoodDealInfos({
      titleWordsLength: getRandomNumberBetween(3, 12),
      contentWordsLength: getRandomNumberBetween(10, 200),
      user: getRandomElement(users),
    })

    allGoodDeals.push(gd)
  }

  return allGoodDeals
}
export default getRandomGoodDeals

import { DeepPartial } from 'typeorm'
import { GoodDeal } from '../../src/entities/goodDeal'
import getIpsumText from '../utils/getIpsumText'
import { User } from '../../src/entities/user'

const getGoodDealInfos = ({
  titleWordsLength,
  contentWordsLength,
  user,
}: {
  titleWordsLength: number
  contentWordsLength: number
  user: User
}): DeepPartial<GoodDeal> => {
  return {
    goodDealTitle: getIpsumText(titleWordsLength),
    goodDealContent: getIpsumText(contentWordsLength),
    user,
  }
}

export default getGoodDealInfos

import { DeepPartial } from 'typeorm'
import getIpsumText from '../utils/getIpsumText'
import { User } from '../../entities/user'
import { GoodDeal } from '../../entities/goodDeal'

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

import { Activity } from '../../entities/activity'
import { Contribution } from '../../entities/contribution'
import { GoodDeal } from '../../entities/goodDeal'
import { GoodDealVote } from '../../entities/goodDealVote'
import { Following } from '../../entities/userIsFollowing'
import { USER_ROLES } from '../../utils/userRoles'
import { userVisibility } from './UserVisibilityOptions'

export interface IUser {
  userId: number
  firstname: string
  lastname: string
  email: string
  password: string
  avatar?: string
  createdAt: Date
  passwordResetToken: string
  passwordResetExpires: Date
  role: USER_ROLES
  goodDeals: GoodDeal[]
  goodDealVotes?: GoodDealVote[]
  activities: Activity[]
  contributions: Contribution[]
  followings: Following[]
  followers: Following[]
  visibility: userVisibility

  createPasswordResetToken: string
}

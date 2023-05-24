import { DeepPartial } from 'typeorm'
import getUserInfos from './getUserInfos'
import { userVisibility } from '../../interfaces/entities/UserVisibilityOptions'
import { User } from '../../entities/user'

const getDevUsersSetObjects = async (): Promise<DeepPartial<User>[]> => {
  const u1 = await getUserInfos({
    firstname: 'William ',
    lastname: 'Davis',
    visibility: userVisibility.public,
  })
  const u2 = await getUserInfos({
    firstname: 'Noah',
    lastname: 'Ramirez',
    visibility: userVisibility.public,
  })
  const u3 = await getUserInfos({
    firstname: 'Ethan',
    lastname: 'Johnson',
    visibility: userVisibility.public,
  })
  const u4 = await getUserInfos({
    firstname: 'Benjamin',
    lastname: 'Martinez',
    visibility: userVisibility.public,
  })
  const u5 = await getUserInfos({ firstname: 'Alexander', lastname: 'Lee' }) // private user
  const u6 = await getUserInfos({
    firstname: 'Emma',
    lastname: 'Nguyen',
    visibility: userVisibility.public,
  })
  const u7 = await getUserInfos({
    firstname: 'Olivia',
    lastname: 'Brown',
    visibility: userVisibility.public,
  })
  const u8 = await getUserInfos({
    firstname: 'Sophia',
    lastname: 'Kim',
    visibility: userVisibility.public,
  })
  const u9 = await getUserInfos({
    firstname: 'Isabella',
    lastname: 'Chen',
    visibility: userVisibility.public,
  })
  const u10 = await getUserInfos({ firstname: 'Mia', lastname: 'Patel' }) // private user

  return [u1, u2, u3, u4, u5, u6, u7, u8, u9, u10]
}
export default getDevUsersSetObjects

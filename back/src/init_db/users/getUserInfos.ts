import { DeepPartial } from 'typeorm'
import * as argon2 from 'argon2'
import getuserMutualPassword from './getuserMutualPassword'
import { User } from '../../entities/user'
import { userVisibility } from '../../interfaces/entities/UserVisibilityOptions'

const getUserInfos = async ({
  firstname,
  lastname,
  visibility = userVisibility.private,
}: {
  firstname: string
  lastname: string
  visibility?: userVisibility
}): Promise<DeepPartial<User>> => {
  const password = getuserMutualPassword()
  const hashedPassword = await argon2.hash(password)
  return {
    firstname: firstname,
    lastname: lastname,
    email: `${firstname.toLowerCase().trim()}.${lastname
      .toLowerCase()
      .trim()}@dev.com`,
    password: hashedPassword,
    visibility,
  }
}

export default getUserInfos

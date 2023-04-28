import { MigrationInterface, QueryRunner } from 'typeorm'
import dataSource from './src/utils/datasource'
import { ActivityType } from './src/entities/activityType'
import getActivityTypes from './init_populate/activities/getActivityTypes'
import { User } from './src/entities/user'
import getUserInfos from './init_populate/users/getUserInfos'
import getDevUsersSetObjects from './init_populate/users/getDevUsersSetObjects'
import getRandomGoodDeals from './init_populate/gooddeals/getRandomGoodDeals'
import { Activity } from './src/entities/activity'

export class PopulateInitDb1682677129699 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const activityTypeRepository = dataSource.getRepository(ActivityType)
    const activityTypes = await activityTypeRepository.find()

    // always set activity types
    if (activityTypes.length !== 6) {
      await activityTypeRepository.delete({})
      const allActivityTypes = getActivityTypes()
      const activityTypeObjects = allActivityTypes.map((type) =>
        activityTypeRepository.create(type)
      )
      await activityTypeRepository.save(activityTypeObjects)
    }

    // always a sample user
    const userRepository = dataSource.getRepository(User)
    const sampleUser = await userRepository.findOneBy({
      email: 'sample.demo@dev.com',
    })

    if (sampleUser === null) {
      const sampleUserInfos = await getUserInfos({
        firstname: 'Sample',
        lastname: 'Demo',
      })
      const sampleUserObject = userRepository.create(sampleUserInfos)
      await userRepository.save(sampleUserObject)
    }

    // IF NODE_ENV DEV
    if (process.env.NODE_ENV === 'development') {
      // add 10 dev users to the database, 8 public and 2 privates, all with common password
      const devUsers = await getDevUsersSetObjects()
      const activityTypeObjects = devUsers.map((user) =>
        userRepository.create(user)
      )
      const addedUsers = await userRepository.save(activityTypeObjects)

      // add some gooddeals to these users
      const goodDealsInfos = getRandomGoodDeals({
        users: addedUsers,
        amountToGenerate: 10,
      })
      const gooDealsRepository = dataSource.getRepository(Activity)
      const goodDealsObjects = goodDealsInfos.map((user) =>
        gooDealsRepository.create(user)
      )
      const addedGoodDeals = await gooDealsRepository.save(goodDealsObjects)

      // add some activities to these users
      // >>> function to generate random activities on a given user ?
      // 2 activities last month or before
      // 2 activities last weeks (2-3 last weeks)
      // 2 activities this week before today
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

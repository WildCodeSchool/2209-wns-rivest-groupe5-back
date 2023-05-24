import { MigrationInterface, QueryRunner } from 'typeorm'
import dataSource from '../utils/datasource'
import { ActivityType } from '../entities/activityType'
import getActivityTypes from '../../init_populate/activities/getActivityTypes'
import { User } from '../entities/user'
import getUserInfos from '../../init_populate/users/getUserInfos'
import getDevUsersSetObjects from '../../init_populate/users/getDevUsersSetObjects'
import getRandomGoodDeals from '../../init_populate/gooddeals/getRandomGoodDeals'
import { Activity } from '../entities/activity'
import { GoodDeal } from '../entities/goodDeal'
import getRandomActivities from '../../init_populate/activities/getRandomActivities'

export class PopulateInitDb implements MigrationInterface {
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
      const existingUsers = await dataSource.getRepository(User).find()

      if (existingUsers.length <= 1) {
        // means only the sample demo user was added
        // add 10 dev users to the database, 8 public and 2 privates, all with common password
        const devUsers = await getDevUsersSetObjects()
        const devUsersObjects = devUsers.map((user) =>
          userRepository.create(user)
        )
        const addedUsers = await userRepository.save(devUsersObjects)

        // add some gooddeals to these users
        const goodDealsInfos = getRandomGoodDeals({
          users: addedUsers,
          amountToGenerate: 10,
        })
        const gooDealsRepository = dataSource.getRepository(GoodDeal)
        const goodDealsObjects = goodDealsInfos.map((goodDeal) =>
          gooDealsRepository.create(goodDeal)
        )
        await gooDealsRepository.save(goodDealsObjects)

        // add some activities to these users
        const activitiesInfos = getRandomActivities({
          users: addedUsers,
        })
        const activitiesRepository = dataSource.getRepository(Activity)
        const activitiesObjects = activitiesInfos.map((activity) =>
          activitiesRepository.create(activity)
        )
        await activitiesRepository.save(activitiesObjects)
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}

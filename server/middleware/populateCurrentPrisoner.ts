import { RequestHandler } from 'express'
import logger from '../../logger'
import PrisonerSearchService from '../services/prisonerSearchService'
import { UserDetails } from '../data/manageUsersApiClient'
import UserService from '../services/userService'

export default function populateCurrentPrisoner(
  prisonerSearchService: PrisonerSearchService,
  userService: UserService,
): RequestHandler {
  return async (req, res, next) => {
    const { nomsId } = req.params as { nomsId: string }
    const user = await userService.getUser(res.locals.user.token)

    if (user && nomsId) {
      try {
        const prisoner = await prisonerSearchService.getPrisonerDetails(nomsId, user as UserDetails)
        res.locals.prisoner = prisoner
      } catch (error) {
        logger.error(error, `Failed to get prisoner with prisoner number: ${nomsId}`)
        return next(error)
      }
    }

    return next()
  }
}

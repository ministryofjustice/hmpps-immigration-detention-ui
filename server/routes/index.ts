import { Router } from 'express'

import type { Services } from '../services'
import ImmigrationDetentionRoutes from './immigrationDetentionRoutes'

export default function routes(service: Services): Router {
  const router = Router()
  const immigrationDetentionRoutes = new ImmigrationDetentionRoutes(service.immigrationDetentionStoreService)

  router.get('/', (req, res) => res.render('pages/index'))

  router.get('/:nomsId/immigrationDetention/add', immigrationDetentionRoutes.add)
  router.get('/:nomsId/immigrationDetention/:addOrEdit/recordType/:id', immigrationDetentionRoutes.addRecordType)
  router.post('/:nomsId/immigrationDetention/:addOrEdit/recordType/:id', immigrationDetentionRoutes.submitRecordType)

  router.get('/:nomsId/immigrationDetention/:addOrEdit/documentDate/:id', immigrationDetentionRoutes.addDocumentDate)
  router.post(
    '/:nomsId/immigrationDetention/:addOrEdit/documentDate/:id',
    immigrationDetentionRoutes.submitDocumentDate,
  )

  router.get('/:nomsId/immigrationDetention/:addOrEdit/hoRef/:id', immigrationDetentionRoutes.addHORefNumber)
  router.post('/:nomsId/immigrationDetention/:addOrEdit/hoRef/:id', immigrationDetentionRoutes.submitHORefNumber)

  router.get('/:nomsId/immigrationDetention/add/review/:id', immigrationDetentionRoutes.review)
  router.post('/:nomsId/immigrationDetention/add/review/:id', immigrationDetentionRoutes.submitReview)

  router.get(
    '/:nomsId/immigrationDetention/:addOrEdit/noLongerInterestReason/:id',
    immigrationDetentionRoutes.addNoLongerOfInterestReason,
  )
  router.post(
    '/:nomsId/immigrationDetention/:addOrEdit/noLongerInterestReason/:id',
    immigrationDetentionRoutes.submitNoLongerOfInterestType,
  )

  router.get('/:nomsId/immigrationDetention/:addOrEdit/confirmedDate/:id', immigrationDetentionRoutes.addConfirmedDate)
  router.post(
    '/:nomsId/immigrationDetention/:addOrEdit/confirmedDate/:id',
    immigrationDetentionRoutes.submitConfirmedDate,
  )

  return router
}

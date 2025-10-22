import { Router } from 'express'

import type { Services } from '../services'
import ImmigrationDetentionRoutes from './immigrationDetentionRoutes'
import PrisonerImageRoutes from './prisonerImageRoutes'

export default function routes(service: Services): Router {
  const router = Router()
  const immigrationDetentionRoutes = new ImmigrationDetentionRoutes(service.immigrationDetentionStoreService)
  const prisonerImageRoutes = new PrisonerImageRoutes(service.prisonerSearchService)

  router.get('/', (req, res) => res.render('pages/index'))
  router.get('/:nomsId/image', prisonerImageRoutes.getImage)

  router.get('/:nomsId/immigration-detention/add', immigrationDetentionRoutes.add)
  router.get('/:nomsId/immigration-detention/:addOrEdit/record-type/:id', immigrationDetentionRoutes.addRecordType)
  router.post('/:nomsId/immigration-detention/:addOrEdit/record-type/:id', immigrationDetentionRoutes.submitRecordType)

  router.get('/:nomsId/immigration-detention/:addOrEdit/document-date/:id', immigrationDetentionRoutes.addDocumentDate)
  router.post(
    '/:nomsId/immigration-detention/:addOrEdit/document-date/:id',
    immigrationDetentionRoutes.submitDocumentDate,
  )

  router.get('/:nomsId/immigration-detention/:addOrEdit/ho-ref/:id', immigrationDetentionRoutes.addHORefNumber)
  router.post('/:nomsId/immigration-detention/:addOrEdit/ho-ref/:id', immigrationDetentionRoutes.submitHORefNumber)

  router.get('/:nomsId/immigration-detention/add/review/:id', immigrationDetentionRoutes.review)
  router.post('/:nomsId/immigration-detention/add/review/:id', immigrationDetentionRoutes.submitReview)

  router.get(
    '/:nomsId/immigration-detention/:addOrEdit/no-longer-interest-reason/:id',
    immigrationDetentionRoutes.addNoLongerOfInterestReason,
  )
  router.post(
    '/:nomsId/immigration-detention/:addOrEdit/no-longer-interest-reason/:id',
    immigrationDetentionRoutes.submitNoLongerOfInterestType,
  )

  router.get(
    '/:nomsId/immigration-detention/:addOrEdit/confirmed-date/:id',
    immigrationDetentionRoutes.addConfirmedDate,
  )
  router.post(
    '/:nomsId/immigration-detention/:addOrEdit/confirmed-date/:id',
    immigrationDetentionRoutes.submitConfirmedDate,
  )

  return router
}

import { Router } from 'express'

import type { Services } from '../services'
import ImmigrationDetentionRoutes from './immigrationDetentionRoutes'
import PrisonerImageRoutes from './prisonerImageRoutes'

export default function routes(service: Services): Router {
  const router = Router()
  const immigrationDetentionRoutes = new ImmigrationDetentionRoutes(
    service.immigrationDetentionStoreService,
    service.immigrationDetentionService,
  )
  const prisonerImageRoutes = new PrisonerImageRoutes(service.prisonerSearchService)

  router.get('/', (req, res) => res.render('pages/index'))
  router.get('/:nomsId/image', prisonerImageRoutes.getImage)

  router.get('/:nomsId/immigration-detention/add', immigrationDetentionRoutes.add)
  router.get(
    '/:nomsId/immigration-detention/:addOrEditOrUpdate/record-type/:id',
    immigrationDetentionRoutes.addRecordType,
  )
  router.post(
    '/:nomsId/immigration-detention/:addOrEditOrUpdate/record-type/:id',
    immigrationDetentionRoutes.submitRecordType,
  )

  router.get(
    '/:nomsId/immigration-detention/:addOrEditOrUpdate/document-date/:id',
    immigrationDetentionRoutes.addDocumentDate,
  )
  router.post(
    '/:nomsId/immigration-detention/:addOrEditOrUpdate/document-date/:id',
    immigrationDetentionRoutes.submitDocumentDate,
  )

  router.get('/:nomsId/immigration-detention/:addOrEditOrUpdate/ho-ref/:id', immigrationDetentionRoutes.addHORefNumber)
  router.post(
    '/:nomsId/immigration-detention/:addOrEditOrUpdate/ho-ref/:id',
    immigrationDetentionRoutes.submitHORefNumber,
  )

  router.get('/:nomsId/immigration-detention/:addOrEditOrUpdate/review/:id', immigrationDetentionRoutes.review)
  router.post('/:nomsId/immigration-detention/:addOrEditOrUpdate/review/:id', immigrationDetentionRoutes.submitReview)

  router.get(
    '/:nomsId/immigration-detention/:addOrEditOrUpdate/no-longer-interest-reason/:id',
    immigrationDetentionRoutes.addNoLongerOfInterestReason,
  )
  router.post(
    '/:nomsId/immigration-detention/:addOrEditOrUpdate/no-longer-interest-reason/:id',
    immigrationDetentionRoutes.submitNoLongerOfInterestType,
  )

  router.get(
    '/:nomsId/immigration-detention/:addOrEditOrUpdate/confirmed-date/:id',
    immigrationDetentionRoutes.addConfirmedDate,
  )
  router.post(
    '/:nomsId/immigration-detention/:addOrEditOrUpdate/confirmed-date/:id',
    immigrationDetentionRoutes.submitConfirmedDate,
  )

  router.get('/:nomsId/immigration-detention/overview', immigrationDetentionRoutes.overview)

  router.get('/:nomsId/immigration-detention/delete/:id', immigrationDetentionRoutes.delete)
  router.post('/:nomsId/immigration-detention/delete/:id', immigrationDetentionRoutes.submitDelete)

  return router
}

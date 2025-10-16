import { RequestHandler, Router } from 'express'

import type { Services } from '../services'
import asyncMiddleware from '../middleware/asyncMiddleware'
import ImmigrationDetentionRoutes from './immigrationDetentionRoutes'

export default function routes(service: Services): Router {
  const router = Router()
  const immigrationDetentionRoutes = new ImmigrationDetentionRoutes(service.immigrationDetentionStoreService)

  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', (req, res) => res.render('pages/index'))

  get('/:nomsId/immigrationDetention/add', immigrationDetentionRoutes.add)
  get('/:nomsId/immigrationDetention/:addOrEdit/recordType/:id', immigrationDetentionRoutes.addRecordType)
  post('/:nomsId/immigrationDetention/:addOrEdit/recordType/:id', immigrationDetentionRoutes.submitRecordType)

  get('/:nomsId/immigrationDetention/:addOrEdit/documentDate/:id', immigrationDetentionRoutes.addDocumentDate)
  post('/:nomsId/immigrationDetention/:addOrEdit/documentDate/:id', immigrationDetentionRoutes.submitDocumentDate)

  get('/:nomsId/immigrationDetention/:addOrEdit/hoRef/:id', immigrationDetentionRoutes.addHORefNumber)
  post('/:nomsId/immigrationDetention/:addOrEdit/hoRef/:id', immigrationDetentionRoutes.submitHORefNumber)

  get('/:nomsId/immigrationDetention/add/review/:id', immigrationDetentionRoutes.review)
  post('/:nomsId/immigrationDetention/add/review/:id', immigrationDetentionRoutes.submitReview)

  return router
}

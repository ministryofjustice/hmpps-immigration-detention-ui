import { RequestHandler } from 'express'
import { randomUUID } from 'crypto'
import ImmigrationDetentionStoreService from '../services/immigrationDetentionStoreService'
import ImmigrationDetentionRecordTypeModel from '../model/immigrationDetentionRecordTypeModel'
import ImmigrationDetentionDocumentDateModel from '../model/immigrationDetentionDocumentDateModel'
import ImmigrationDetentionHORefModel from '../model/immigrationDetentionHORefNoModel'
import ImmigrationDetentionReviewModel from '../model/immigrationDetentionReviewModel'
import ImmigrationDetentionResultPageModel from '../model/immigrationDetentionResultPageModel'
import ImmigrationDetentionNoLongerInterestModel from '../model/immigrationDetentionNoLongerInterestModel'
import ImmigrationDetentionConfirmedDateModel from '../model/immigrationDetentionConfirmedDateModel'

export default class ImmigrationDetentionRoutes {
  constructor(private readonly immigrationDetentionStoreService: ImmigrationDetentionStoreService) {}

  public review: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId, id } = req.params
    const immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)

    return res.render('pages/reviewImmigrationDetentionRecord', {
      model: new ImmigrationDetentionReviewModel(nomsId, id, immigrationDetention),
    })
  }

  public submitReview: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId, id } = req.params
    const immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)

    return res.render('pages/resultPage', {
      model: new ImmigrationDetentionResultPageModel(nomsId, id, immigrationDetention),
    })
  }

  public add: RequestHandler = async (req, res): Promise<void> => {
    // await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })
    const { nomsId } = req.params
    const sessionId = randomUUID()

    res.redirect(`/${nomsId}/immigration-detention/add/record-type/${sessionId}`)
  }

  public addRecordType: RequestHandler = async (req, res): Promise<void> => {
    // await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })
    const { nomsId, id } = req.params
    const immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)

    return res.render('pages/immigrationDetentionType', {
      model: new ImmigrationDetentionRecordTypeModel(nomsId, id, immigrationDetention),
    })
  }

  public addNoLongerOfInterestReason: RequestHandler = async (req, res): Promise<void> => {
    // await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })
    const { nomsId, id } = req.params
    const immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)

    return res.render('pages/recordNoLongerInterestReason', {
      model: new ImmigrationDetentionNoLongerInterestModel(nomsId, id, immigrationDetention, true),
    })
  }

  public addDocumentDate: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId, id } = req.params
    const immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)

    return res.render('pages/recordDocumentDate', {
      model: new ImmigrationDetentionDocumentDateModel(nomsId, id, null, immigrationDetention),
    })
  }

  public submitDocumentDate: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId, id } = req.params
    let immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)
    const edit = req.path.includes('/edit')

    const immigrationDetentionDocumentDate = new ImmigrationDetentionDocumentDateModel(
      nomsId,
      id,
      req.body,
      immigrationDetention,
    )
    const errors = await immigrationDetentionDocumentDate.validation()
    immigrationDetentionDocumentDate.errors = errors

    if (errors.length > 0) {
      return res.render('pages/recordDocumentDate', {
        model: immigrationDetentionDocumentDate,
      })
    }

    immigrationDetention = {
      ...immigrationDetention,
      documentDate: immigrationDetentionDocumentDate.toDateModelString(),
    }
    this.immigrationDetentionStoreService.store(req, nomsId, id, immigrationDetention)

    if (edit) {
      return res.redirect(`/${nomsId}/immigration-detention/add/review/${id}`)
    }

    return res.redirect(`/${nomsId}/immigration-detention/add/ho-ref/${id}`)
  }

  public addHORefNumber: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId, id } = req.params
    const immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)
    const immigrationDetentionHomeOfficeRefNo = new ImmigrationDetentionHORefModel(nomsId, id, immigrationDetention)

    return res.render('pages/recordHomeOfficeRefNo', {
      model: immigrationDetentionHomeOfficeRefNo,
    })
  }

  public submitHORefNumber: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId, id } = req.params
    let immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)
    const edit = req.path.includes('/edit')

    const immigrationDetentionHomeOfficeRefNo = new ImmigrationDetentionHORefModel(
      nomsId,
      id,
      immigrationDetention,
      req.body.hoRefNumber,
    )
    const errors = await immigrationDetentionHomeOfficeRefNo.validation()
    immigrationDetentionHomeOfficeRefNo.errors = errors

    if (errors.length > 0) {
      return res.render('pages/recordHomeOfficeRefNo', {
        model: immigrationDetentionHomeOfficeRefNo,
      })
    }

    immigrationDetention = {
      ...immigrationDetention,
      homeOfficeRefNo: immigrationDetentionHomeOfficeRefNo.hoRefNumber,
    }
    this.immigrationDetentionStoreService.store(req, nomsId, id, immigrationDetention)

    if (edit) {
      return res.redirect(`/${nomsId}/immigration-detention/add/review/${id}`)
    }

    return res.redirect(`/${nomsId}/immigration-detention/add/review/${id}`)
  }

  public submitRecordType: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId, id } = req.params
    let immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)
    const edit = req.path.includes('/edit')

    if (!req?.body?.immigrationDetentionRecordType) {
      res.render('pages/immigrationDetentionType', {
        model: new ImmigrationDetentionRecordTypeModel(nomsId, id, immigrationDetention, true),
      })
      return
    }

    immigrationDetention = {
      ...immigrationDetention,
      recordType: req?.body?.immigrationDetentionRecordType,
    }
    this.immigrationDetentionStoreService.store(req, nomsId, id, immigrationDetention)

    if (edit) {
      res.redirect(`/${nomsId}/immigration-detention/add/review/${id}`)
      return
    }

    if (req.body.immigrationDetentionRecordType === 'NO_LONGER_OF_INTEREST') {
      res.redirect(`/${nomsId}/immigration-detention/add/no-longer-interest-reason/${id}`)
      return
    }

    res.redirect(`/${nomsId}/immigration-detention/add/document-date/${id}`)
  }

  public submitNoLongerOfInterestType: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId, id } = req.params
    let immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)
    const edit = req.path.includes('/edit')
    const model = new ImmigrationDetentionNoLongerInterestModel(nomsId, id, immigrationDetention, false, req.body)
    model.validate()

    if (model.errors && model.errors.length > 0) {
      res.render('pages/recordNoLongerInterestReason', {
        model,
      })
      return
    }

    immigrationDetention = {
      ...immigrationDetention,
      noLongerOfInterestReason: req?.body?.noLongerOfInterestReason,
      noLongerOfInterestOtherComment: req?.body?.otherReason,
    }
    this.immigrationDetentionStoreService.store(req, nomsId, id, immigrationDetention)

    if (edit) {
      res.redirect(`/${nomsId}/immigration-detention/add/review/${id}`)
      return
    }

    res.redirect(`/${nomsId}/immigration-detention/add/confirmed-date/${id}`)
  }

  public addConfirmedDate: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId, id } = req.params
    const immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)

    return res.render('pages/recordConfirmedDate', {
      model: new ImmigrationDetentionConfirmedDateModel(nomsId, id, null, immigrationDetention),
    })
  }

  public submitConfirmedDate: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId, id } = req.params
    let immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)
    const edit = req.path.includes('/edit')

    const immigrationDetentionConfirmedDateModel = new ImmigrationDetentionConfirmedDateModel(
      nomsId,
      id,
      req.body,
      immigrationDetention,
    )
    const errors = await immigrationDetentionConfirmedDateModel.validation()
    immigrationDetentionConfirmedDateModel.errors = errors

    if (errors.length > 0) {
      return res.render('pages/recordConfirmedDate', {
        model: immigrationDetentionConfirmedDateModel,
      })
    }

    immigrationDetention = {
      ...immigrationDetention,
      noLongerOfInterestConfirmedDate: immigrationDetentionConfirmedDateModel.toDateModelString(),
    }
    this.immigrationDetentionStoreService.store(req, nomsId, id, immigrationDetention)

    if (edit) {
      return res.redirect(`/${nomsId}/immigration-detention/add/review/${id}`)
    }

    return res.redirect(`/${nomsId}/immigration-detention/add/review/${id}`)
  }
}

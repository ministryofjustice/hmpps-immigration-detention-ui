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
import ImmigrationDetentionOverviewModel from '../model/ImmigrationDetentionOverviewModel'
import ImmigrationDetentionService from '../services/immigrationDetentionService'
import ImmigrationDetentionDeleteModel from '../model/immigrationDetentionDeleteModel'
import { CreateImmigrationDetention } from '../@types/remandAndSentencingApi/remandAndSentencingClientTypes'
import ParamStoreService from '../services/paramStoreService'
import config from '../config'
import { User } from '../data/manageUsersApiClient'
import immigrationDetentionRecordTypes from '../model/immigrationDetentionRecordTypes'
import SessionImmigrationDetention from '../@types/ImmigrationDetention'

export default class ImmigrationDetentionRoutes {
  constructor(
    private readonly immigrationDetentionStoreService: ImmigrationDetentionStoreService,
    private readonly immigrationDetentionService: ImmigrationDetentionService,
    private readonly paramStoreService: ParamStoreService,
  ) {}

  public review: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId, id } = req.params
    const immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)

    return res.render('pages/reviewImmigrationDetentionRecord', {
      model: new ImmigrationDetentionReviewModel(nomsId, id, immigrationDetention),
    })
  }

  public delete: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId, id } = req.params
    const { username = 'Unknown' } = res.locals.user
    const immigrationDetention = await this.immigrationDetentionService.getImmigrationDetentionByUUID(id, username)

    return res.render('pages/deleteImmigrationDetentionRecord', {
      model: new ImmigrationDetentionDeleteModel(nomsId, id, immigrationDetention),
    })
  }

  public submitDelete: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId, id } = req.params
    const { username = 'Unknown' } = res.locals.user
    await this.immigrationDetentionService.deleteImmigrationDetentionByUUID(id, username)

    res.redirect(`/${nomsId}/immigration-detention/overview`)
  }

  public overview: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId } = req.params
    const { username = 'Unknown', userRoles = [] } = res.locals.user
    const { firstName = 'Unknown', lastName = 'Unknown' } = res.locals.prisoner || {}
    const immigrationDetentionList = await this.immigrationDetentionService.getImmigrationDetentionRecordsForPrisoner(
      nomsId,
      username,
    )

    if (immigrationDetentionList.length > 0) {
      return res.render('pages/immigrationDetentionOverview', {
        model: new ImmigrationDetentionOverviewModel(
          nomsId,
          `${firstName} ${lastName}`,
          immigrationDetentionList,
          userRoles,
        ),
      })
    }

    return res.redirect(`${config.services.courtCasesReleaseDates.url}/prisoner/${nomsId}/overview`)
  }

  public submitReview: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId, id } = req.params
    const { username = 'Unknown', activeCaseLoadId = 'Unknown' } = res.locals.user as User
    const immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)
    const outcomes = await this.immigrationDetentionService.getImmigrationDetentionAppearanceOutcomes(username)

    let createdImmigrationDetention: CreateImmigrationDetention = {} as CreateImmigrationDetention

    if (immigrationDetention.immigrationDetentionRecordType === 'NO_LONGER_OF_INTEREST') {
      createdImmigrationDetention = {
        appearanceOutcomeUuid: outcomes.find(
          outcome =>
            outcome.nomisCode ===
            immigrationDetentionRecordTypes.find(it => it.value === immigrationDetention.immigrationDetentionRecordType)
              .nomisCode,
        ).outcomeUuid,
        createdByPrison: activeCaseLoadId,
        createdByUsername: username,
        noLongerOfInterestComment: immigrationDetention.noLongerOfInterestComment,
        noLongerOfInterestReason: immigrationDetention.noLongerOfInterestReason,
        prisonerId: nomsId,
        recordDate: immigrationDetention.recordDate,
        immigrationDetentionRecordType: immigrationDetention.immigrationDetentionRecordType,
      }
    } else if (
      immigrationDetention.immigrationDetentionRecordType === 'IS91' ||
      immigrationDetention.immigrationDetentionRecordType === 'DEPORTATION_ORDER' ||
      immigrationDetention.immigrationDetentionRecordType === 'IMMIGRATION_BAIL'
    ) {
      createdImmigrationDetention = {
        appearanceOutcomeUuid: outcomes.find(
          outcome =>
            outcome.nomisCode ===
            immigrationDetentionRecordTypes.find(it => it.value === immigrationDetention.immigrationDetentionRecordType)
              .nomisCode,
        ).outcomeUuid,
        createdByPrison: activeCaseLoadId,
        createdByUsername: username,
        homeOfficeReferenceNumber: immigrationDetention.homeOfficeReferenceNumber,
        prisonerId: nomsId,
        recordDate: immigrationDetention.recordDate,
        immigrationDetentionRecordType: immigrationDetention.immigrationDetentionRecordType,
      }
    }

    if (this.paramStoreService.get(req, 'isUpdate')) {
      this.paramStoreService.clearAll(req)
      await this.immigrationDetentionService.updateImmigrationDetention(id, createdImmigrationDetention, username)
      return res.redirect(`/${nomsId}/immigration-detention/overview`)
    }
    this.paramStoreService.clearAll(req)
    await this.immigrationDetentionService.createImmigrationDetention(createdImmigrationDetention, username)
    return res.render('pages/resultPage', {
      model: new ImmigrationDetentionResultPageModel(nomsId, id, immigrationDetention),
    })
  }

  public add: RequestHandler = async (req, res): Promise<void> => {
    // await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })
    const { nomsId } = req.params
    const sessionId = randomUUID()
    this.paramStoreService.clearAll(req)

    this.immigrationDetentionStoreService.store(req, nomsId, sessionId, {
      prisonerId: nomsId,
    } as unknown as SessionImmigrationDetention)

    res.redirect(`/${nomsId}/immigration-detention/add/record-type/${sessionId}`)
  }

  public addRecordType: RequestHandler = async (req, res): Promise<void> => {
    // await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })
    const { nomsId, id } = req.params

    let immigrationDetention = null

    immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)
    if (immigrationDetention != null)
      return res.render('pages/immigrationDetentionType', {
        model: new ImmigrationDetentionRecordTypeModel(nomsId, id, immigrationDetention),
      })

    return res.redirect(`/${nomsId}/immigration-detention/overview`)
  }

  public addNoLongerOfInterestReason: RequestHandler = async (req, res): Promise<void> => {
    // await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })
    const { nomsId, id, addOrEditOrUpdate } = req.params
    const { username = 'Unknown' } = res.locals.user
    let immigrationDetention
    if (addOrEditOrUpdate === 'update') {
      this.paramStoreService.store(req, 'isUpdate', true)
      immigrationDetention = await this.immigrationDetentionService.getImmigrationDetentionByUUID(id, username)
    } else {
      immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)
    }
    if (immigrationDetention != null) {
      this.immigrationDetentionStoreService.store(req, nomsId, id, immigrationDetention)

      return res.render('pages/recordNoLongerInterestReason', {
        model: new ImmigrationDetentionNoLongerInterestModel(
          nomsId,
          id,
          immigrationDetention,
          true,
          {},
          addOrEditOrUpdate,
        ),
      })
    }
    return res.redirect(`/${nomsId}/immigration-detention/overview`)
  }

  public addDocumentDate: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId, id, addOrEditOrUpdate } = req.params
    const { username = 'Unknown' } = res.locals.user

    let immigrationDetention
    if (addOrEditOrUpdate === 'update') {
      this.paramStoreService.store(req, 'isUpdate', true)
      immigrationDetention = await this.immigrationDetentionService.getImmigrationDetentionByUUID(id, username)
    } else {
      immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)
    }
    if (immigrationDetention != null) {
      this.immigrationDetentionStoreService.store(req, nomsId, id, immigrationDetention)

      return res.render('pages/recordDocumentDate', {
        model: new ImmigrationDetentionDocumentDateModel(nomsId, id, null, immigrationDetention, addOrEditOrUpdate),
      })
    }
    return res.redirect(`/${nomsId}/immigration-detention/overview`)
  }

  public submitDocumentDate: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId, id, addOrEditOrUpdate } = req.params
    let immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)

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
      recordDate: immigrationDetentionDocumentDate.toDateModelString(),
    }
    this.immigrationDetentionStoreService.store(req, nomsId, id, immigrationDetention)

    if (addOrEditOrUpdate === 'edit') {
      return res.redirect(`/${nomsId}/immigration-detention/${addOrEditOrUpdate}/review/${id}`)
    }

    return res.redirect(`/${nomsId}/immigration-detention/${addOrEditOrUpdate}/ho-ref/${id}`)
  }

  public addHORefNumber: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId, id, addOrEditOrUpdate } = req.params
    let immigrationDetention = null
    immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)

    if (immigrationDetention != null) {
      const immigrationDetentionHomeOfficeRefNo = new ImmigrationDetentionHORefModel(
        nomsId,
        id,
        immigrationDetention,
        addOrEditOrUpdate,
      )

      return res.render('pages/recordHomeOfficeRefNo', {
        model: immigrationDetentionHomeOfficeRefNo,
      })
    }
    return res.redirect(`/${nomsId}/immigration-detention/overview`)
  }

  public submitHORefNumber: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId, id, addOrEditOrUpdate } = req.params
    let immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)

    const immigrationDetentionHomeOfficeRefNo = new ImmigrationDetentionHORefModel(
      nomsId,
      id,
      immigrationDetention,
      addOrEditOrUpdate,
      req.body.hoRefNumber,
    )
    const errors = await immigrationDetentionHomeOfficeRefNo.validation(req.body.hoRefNumber)
    immigrationDetentionHomeOfficeRefNo.errors = errors

    if (errors.length > 0) {
      return res.render('pages/recordHomeOfficeRefNo', {
        model: immigrationDetentionHomeOfficeRefNo,
      })
    }

    immigrationDetention = {
      ...immigrationDetention,
      homeOfficeReferenceNumber: immigrationDetentionHomeOfficeRefNo.hoRefNumber,
    }
    this.immigrationDetentionStoreService.store(req, nomsId, id, immigrationDetention)

    return res.redirect(`/${nomsId}/immigration-detention/${addOrEditOrUpdate}/review/${id}`)
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
      immigrationDetentionRecordType: req?.body?.immigrationDetentionRecordType,
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
    const { nomsId, id, addOrEditOrUpdate } = req.params
    let immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)
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
      noLongerOfInterestComment: req?.body?.otherReason,
    }
    this.immigrationDetentionStoreService.store(req, nomsId, id, immigrationDetention)

    if (addOrEditOrUpdate === 'edit') {
      res.redirect(`/${nomsId}/immigration-detention/${addOrEditOrUpdate}/review/${id}`)
      return
    }

    res.redirect(`/${nomsId}/immigration-detention/${addOrEditOrUpdate}/confirmed-date/${id}`)
  }

  public addConfirmedDate: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId, id, addOrEditOrUpdate } = req.params
    let immigrationDetention = null
    immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)

    if (immigrationDetention != null) {
      return res.render('pages/recordConfirmedDate', {
        model: new ImmigrationDetentionConfirmedDateModel(nomsId, id, null, immigrationDetention, addOrEditOrUpdate),
      })
    }
    return res.redirect(`/${nomsId}/immigration-detention/overview`)
  }

  public submitConfirmedDate: RequestHandler = async (req, res): Promise<void> => {
    const { nomsId, id, addOrEditOrUpdate } = req.params
    let immigrationDetention = this.immigrationDetentionStoreService.getById(req, nomsId, id)

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
      recordDate: immigrationDetentionConfirmedDateModel.toDateModelString(),
    }
    this.immigrationDetentionStoreService.store(req, nomsId, id, immigrationDetention)

    return res.redirect(`/${nomsId}/immigration-detention/${addOrEditOrUpdate}/review/${id}`)
  }
}

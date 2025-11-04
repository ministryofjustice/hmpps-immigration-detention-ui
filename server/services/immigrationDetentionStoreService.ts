import { Request } from 'express'
import { randomUUID } from 'crypto'
import SessionImmigrationDetention from '../@types/ImmigrationDetention'

export default class ImmigrationDetentionStoreService {
  private initSessionForNomsId(req: Request, nomsId: string) {
    if (!req.session.immigrationDetention) {
      req.session.immigrationDetention = {}
    }
    if (!req.session.immigrationDetention[nomsId]) {
      req.session.immigrationDetention[nomsId] = {}
    }
  }

  public clear(req: Request, nomsId: string) {
    this.initSessionForNomsId(req, nomsId)
    req.session.immigrationDetention[nomsId] = {}
  }

  /* Functions for forms that create adjustments one at a time */
  public getOnly(req: Request, nomsId: string): SessionImmigrationDetention {
    this.initSessionForNomsId(req, nomsId)
    const key = Object.keys(req.session.immigrationDetention[nomsId])[0]
    return req.session.immigrationDetention[nomsId][key]
  }

  public storeOnly(req: Request, nomsId: string, immigrationDetention: SessionImmigrationDetention) {
    this.initSessionForNomsId(req, nomsId)
    const keys = Object.keys(req.session.immigrationDetention[nomsId])
    if (keys.length) {
      const key = keys[0]
      req.session.immigrationDetention[nomsId][key] = immigrationDetention
    } else {
      const id = randomUUID()
      req.session.immigrationDetention[nomsId][id] = immigrationDetention
    }
  }

  /* Functions for forms that create multiple */
  public store(req: Request, nomsId: string, reqId: string, immigrationDetention: SessionImmigrationDetention): string {
    this.initSessionForNomsId(req, nomsId)
    const id = reqId || randomUUID()
    req.session.immigrationDetention[nomsId][id] = immigrationDetention
    return id
  }

  public getById(req: Request, nomsId: string, id: string): SessionImmigrationDetention {
    this.initSessionForNomsId(req, nomsId)
    return req.session.immigrationDetention[nomsId][id]
  }

  public getAll(req: Request, nomsId: string): Record<string, SessionImmigrationDetention> {
    this.initSessionForNomsId(req, nomsId)
    return req.session.immigrationDetention[nomsId]
  }

  public remove(req: Request, nomsId: string, id: string) {
    delete req.session.immigrationDetention[nomsId][id]
  }
}

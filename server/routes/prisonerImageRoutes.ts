import { Request, Response } from 'express'
import path from 'path'
import PrisonerSearchService from '../services/prisonerSearchService'

const placeHolderImage = path.join(process.cwd(), '/dist/assets/images/prisoner-profile-image.png')

export default class PrisonerImageRoutes {
  constructor(private readonly prisonerService: PrisonerSearchService) {}

  getImage = async (req: Request, res: Response): Promise<void> => {
    const { nomsId } = req.params

    return this.prisonerService
      .getPrisonerImage(nomsId, res.locals.user)
      .then(data => {
        res.set('Cache-control', 'private, max-age=86400')
        res.removeHeader('pragma')
        res.type('image/jpeg')
        data.pipe(res)
      })
      .catch(_error => {
        res.sendFile(placeHolderImage)
      })
  }
}
